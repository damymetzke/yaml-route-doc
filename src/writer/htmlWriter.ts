import * as handlebars from 'handlebars';
import * as path from 'path';
import { promises as fs } from 'fs';
import IWriter from './writer';
import { RouteData } from '../data/routeData';
import ConfigData from '../config/configData';

async function registerPartials(partialsPath?: string): Promise<void> {
  if (!partialsPath) {
    return;
  }

  const partialFiles = await fs.readdir(partialsPath);
  await Promise.all(partialFiles.map(async (file) => {
    const fileData = (await fs.readFile(path.join(partialsPath, file))).toString();
    handlebars.registerPartial(
      file.replace(/.handlebars$/, ''),
      handlebars.compile(fileData),
    );
  }));
}

export default class HtmlWriter implements IWriter {
  #indexTemplate?: handlebars.TemplateDelegate<any>;

  #routeTemplate?: handlebars.TemplateDelegate<any>;

  async init(config: ConfigData): Promise<this> {
    await Promise.all([
      registerPartials(config.partials),
      this.compileTemplates(config.templates),
    ]);

    return this;
  }

  static async create(config: ConfigData): Promise<HtmlWriter> {
    const result = new HtmlWriter();
    await result.init(config);
    return result;
  }

  async writeIndex(data: any): Promise<string> {
    return this.#indexTemplate
      ? this.#indexTemplate(data)
      : '<!-- Problem when generating page -->'; // todo: return error page upon failure
  }

  async writeRoute(data: RouteData): Promise<string> {
    return this.#routeTemplate
      ? this.#routeTemplate(data)
      : '<!-- Problem when generating page -->'; // todo: return error page upon failure
  }

  private async compileTemplates(templatesPath: string): Promise<void> {
    this.#indexTemplate = handlebars.compile((await fs.readFile(path.join(templatesPath, 'index.handlebars'))).toString());
    this.#routeTemplate = handlebars.compile((await fs.readFile(path.join(templatesPath, 'route.handlebars'))).toString());
  }
}
