import { promises as fs } from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';

export default class ConfigData {
    routesDir: string = '';

    outputDir: string = '';

    style: string = '';

    templates: string = '';

    partials?: string;

    async load(filePath: string): Promise<this> {
      const fileData = await fs.readFile(filePath);
      const rawData = yaml.parse(fileData.toString());

      if (!ConfigData.verify(rawData)) {
        throw new Error('Invalid config file');
      }

      this.routesDir = path.join(path.dirname(filePath), rawData.routesDir);
      this.outputDir = path.join(path.dirname(filePath), rawData.outputDir);
      this.style = rawData.style
        ? rawData.style
        : '';
      this.templates = path.join(path.dirname(filePath), rawData.templates);
      this.partials = path.join(path.dirname(filePath), rawData.partials);

      return this;
    }

    static verify(data: object): boolean {
      if (!('routesDir' in data)) {
        return false; // mandatory
      }

      if (!('outputDir' in data)) {
        return false; // mandatory
      }

      return true;
    }
}
