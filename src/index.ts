import { ArgumentParser } from 'argparse';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import ConfigData from './config/configData';
import { RouteData } from './data/routeData';
import HtmlWriter from './writer/htmlWriter';

export async function document(configPath: string) {
  const config = new ConfigData();
  await config.load(configPath);
  const writer = new HtmlWriter();
  const files = await fs.readdir(config.routesDir);
  const results = files.map(async (file) => {
    const data = yaml.parse((await fs.readFile(path.join(config.routesDir, file))).toString());
    data.routes.forEach(async (route: any) => {
      const result = await writer.writeRoute({
        global: {
          classPrefix: 'routedoc--',
          style: config.style,
        },
        ...route, // todo: add validation to data
      });
      await fs.writeFile(`${path.join(config.outputDir, route.name.replace(/\//g, '_')).replace(/{/g, '_').replace(/}/g, '')}.html`, result);
    });
  });

  await Promise.all(results);
}

const parser = new ArgumentParser();

parser.add_argument('-c', '--config', { help: 'Set config file', default: 'yamlroutedocumenter.config.yml' });

const args = parser.parse_args();
document(args.config);
