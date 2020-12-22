import { promises as fs } from "fs";
import * as path from "path";
import * as sass from "sass";
import generateRouteValidator from "./validate/routeValidator";
import generateGroupValidator from "./validate/groupValidator";
import ValidateResult from "./validate/validateResult";
import ConfigData from "./config/configData";
import HtmlWriter from "./writer/htmlWriter";
import parseInput from "./parser/parseInput";
import { AllData } from "./data";

export async function document(configPath: string) {
  const config = new ConfigData();
  await config.load(configPath);
  const writer = await HtmlWriter.create(config);

  const data: AllData = <AllData>{
    ...(await parseInput(config.routesDir)),
    global: {
      classPrefix: "routedoc--",
      style: "style.css",
    },
  };

  const routeValidator = generateRouteValidator();
  const groupValidator = generateGroupValidator();

  let success = true;

  const routeResults: any[] = [];
  const groupResults: any[] = [];

  data.routes.forEach((route) => {
    const result = routeValidator.validate(route);

    const resultName = result.data?.name ? result.data.name : "Unknown route";

    if (result.messages.length === 0) {
      routeResults.push(result.data);
      return;
    }
    success = false;
    console.warn(`\n###route:${resultName}`);
    result.messages.forEach((message) => {
      console.warn(`    [${message.key}] => ${message.problem}`);
    });
  });

  data.groups.forEach((group) => {
    const result = groupValidator.validate(group);

    const resultName = result.data?.name ? result.data.name : "Unknown group";

    if (result.messages.length === 0) {
      groupResults.push(result.data);
      return;
    }

    success = false;
    console.warn(`\n###group:${resultName}`);
    result.messages.forEach((message) => {
      console.warn(`    [${message.key}] => ${message.problem}`);
    });
  });

  if (!success) {
    return;
  }

  await fs.mkdir(path.join(config.outputDir, "routes"), { recursive: true });
  await fs.mkdir(path.join(config.outputDir, "groups"), { recursive: true });
  await Promise.all(
    routeResults.map(async (route) => {
      const writtenRoute = await writer.writeRoute(route, {
        ...data.global,
        style: "../style.css",
      });
      await fs.writeFile(
        `${path
          .join(config.outputDir, "routes", route.name.replace(/\//g, "_"))
          .replace(/{/g, "_")
          .replace(/}/g, "")}.html`,
        writtenRoute
      );
    })
  );

  await Promise.all(
    groupResults.map(async (group) => {
      const writtenGroup = await writer.writeGroup(group, {
        ...data.global,
        style: "../style.css",
      });
      await fs.writeFile(
        `${path
          .join(config.outputDir, "groups", group.name.replace(/\//g, "_"))
          .replace(/{/g, "_")
          .replace(/}/g, "")}.html`,
        writtenGroup
      );
    })
  );

  const writtenIndex = await writer.writeIndex(data);

  await fs.writeFile(path.join(config.outputDir, "index.html"), writtenIndex);
  if (/.s[ca]ss$/.test(config.style)) {
    const renderedCss = sass.renderSync({
      file: config.style,
    });

    await fs.writeFile(
      path.join(config.outputDir, "style.css"),
      renderedCss.css
    );
  } else {
    await fs.copyFile(config.style, path.join(config.outputDir, "style.css"));
  }
}
