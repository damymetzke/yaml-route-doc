import * as handlebars from "handlebars";
import * as path from "path";
import { promises as fs } from "fs";
import IWriter from "./writer";
import { AllData, GlobalData, GroupData, RouteData } from "../data";
import ConfigData from "../config/configData";

async function registerPartials(partialsPath?: string): Promise<void> {
  if (!partialsPath) {
    return;
  }

  const partialFiles = await fs.readdir(partialsPath);
  await Promise.all(
    partialFiles.map(async (file) => {
      const fileData = (
        await fs.readFile(path.join(partialsPath, file))
      ).toString();
      handlebars.registerPartial(
        file.replace(/.handlebars$/, ""),
        handlebars.compile(fileData)
      );
    })
  );
}

export default class HtmlWriter implements IWriter {
  #indexTemplate?: handlebars.TemplateDelegate<any>;

  #routeTemplate?: handlebars.TemplateDelegate<any>;

  #groupTemplate?: handlebars.TemplateDelegate<any>;

  async init(config: ConfigData): Promise<this> {
    await Promise.all([
      registerPartials(config.partials),
      this.compileTemplates(config.templates),
    ]);

    handlebars.registerHelper(
      "routeToFile",
      (routeName) =>
        `${routeName
          .replace(/\//g, "_")
          .replace(/{/g, "_")
          .replace(/}/g, "")}.html`
    );

    handlebars.registerHelper(
      "concat",
      (a: string, b: string): string => a + b
    );

    return this;
  }

  static async create(config: ConfigData): Promise<HtmlWriter> {
    const result = new HtmlWriter();
    await result.init(config);
    return result;
  }

  async writeIndex(data: AllData): Promise<string> {
    return this.#indexTemplate
      ? this.#indexTemplate(data)
      : "<!-- Problem when generating page -->"; // todo: return error page upon failure
  }

  async writeRoute(data: RouteData, global: GlobalData): Promise<string> {
    return this.#routeTemplate
      ? this.#routeTemplate({ ...data, global })
      : "<!-- Problem when generating page -->"; // todo: return error page upon failure
  }

  async writeGroup(data: any, global: any): Promise<string> {
    return this.#groupTemplate
      ? this.#groupTemplate({ ...data, global })
      : "<!-- Problem when generating page -->"; // todo: return error page upon failure
  }

  private async compileTemplates(templatesPath: string): Promise<void> {
    this.#indexTemplate = handlebars.compile(
      (
        await fs.readFile(path.join(templatesPath, "index.handlebars"))
      ).toString(),
      {
        preventIndent: true,
      }
    );
    this.#routeTemplate = handlebars.compile(
      (
        await fs.readFile(path.join(templatesPath, "route.handlebars"))
      ).toString(),
      {
        preventIndent: true,
      }
    );
    this.#groupTemplate = handlebars.compile(
      (
        await fs.readFile(path.join(templatesPath, "group.handlebars"))
      ).toString(),
      {
        preventIndent: true,
      }
    );
  }
}
