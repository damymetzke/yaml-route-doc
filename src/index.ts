import { ArgumentParser } from 'argparse';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import ConfigData from './config/configData';
import { RouteData } from './data/routeData';
import HtmlWriter from './writer/htmlWriter';
import parseInput from './parser/parseInput';

export async function document(configPath: string) {
  const config = new ConfigData();
  await config.load(configPath);
  const writer = await HtmlWriter.create(config);

  const routes = await parseInput(config.routesDir);
  await Promise.all(routes.map(async (route) => {
    const writtenRoute = await writer.writeRoute({
      ...route,
      global: {
        classPrefix: 'routedoc--',
        style: config.style,
      },
    });
    await fs.writeFile(`${path.join(config.outputDir, route.name.replace(/\//g, '_')).replace(/{/g, '_').replace(/}/g, '')}.html`, writtenRoute);
  }));
}
