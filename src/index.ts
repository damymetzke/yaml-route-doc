import { promises as fs } from 'fs';
import * as path from 'path';
import * as sass from 'sass';
import ConfigData from './config/configData';
import HtmlWriter from './writer/htmlWriter';
import parseInput from './parser/parseInput';

export async function document(configPath: string) {
  const config = new ConfigData();
  await config.load(configPath);
  const writer = await HtmlWriter.create(config);

  const routes = await parseInput(config.routesDir);
  await fs.mkdir(path.join(config.outputDir, 'routes'), { recursive: true });
  await Promise.all(routes.map(async (route) => {
    const writtenRoute = await writer.writeRoute({
      ...route,
      global: {
        classPrefix: 'routedoc--',
        style: '../style.css',
      },
    });
    await fs.writeFile(`${path.join(config.outputDir, 'routes', route.name.replace(/\//g, '_')).replace(/{/g, '_').replace(/}/g, '')}.html`, writtenRoute);
  }));

  const writtenIndex = await writer.writeIndex({
    routes,
    global: {
      classPrefix: 'routedoc--',
      style: 'style.css',
    },
  });

  await fs.writeFile(path.join(config.outputDir, 'index.html'), writtenIndex);
  if (/.s[ca]ss$/.test(config.style)) {
    const renderedCss = sass.renderSync({
      file: config.style,
    });

    await fs.writeFile(path.join(config.outputDir, 'style.css'), renderedCss.css);
  } else {
    await fs.copyFile(config.style, path.join(config.outputDir, 'style.css'));
  }
}
