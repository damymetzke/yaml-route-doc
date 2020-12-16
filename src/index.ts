import { promises as fs } from "fs";
import * as path from "path";
import * as sass from "sass";
import generateRouteValidator from "./validate/routeValidator";
import generateGroupValidator from "./validate/groupValidator";
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

  if (
    data.routes.some((route) => {
      const result = routeValidator.validate(route);

      result.messages.forEach((message) => {
        console.warn(`[${message.key}] => ${message.problem}`);
      });

      return !result.success;
    }) ||
    data.groups.some((group) => {
      const result = groupValidator.validate(group);

      result.messages.forEach((message) => {
        console.warn(`[${message.key}] => ${message.problem}`);
      });

      return !result.success;
    })
  ) {
    console.log("invalid data!");
  }
  await fs.mkdir(path.join(config.outputDir, "routes"), { recursive: true });
  await fs.mkdir(path.join(config.outputDir, "groups"), { recursive: true });
  await Promise.all(
    data.routes.map(async (route) => {
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
    data.groups.map(async (group) => {
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
