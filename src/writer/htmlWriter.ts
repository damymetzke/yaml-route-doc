import * as handlebars from 'handlebars';
import * as path from 'path';
import { promises as fs } from 'fs';
import IWriter from './writer';
import { RouteData } from '../data/routeData';

export default class HtmlWriter implements IWriter {
  async writeRoute(data: RouteData): Promise<string> {
    const template = handlebars.compile(await (await fs.readFile(path.join(__dirname, '../../resource/htmlTemplate/route.handlebars'))).toString());
    return template(data);
  }
}
