import { ArgumentParser } from 'argparse';
import { promises as fs } from 'fs';
import * as path from 'path';
import ConfigData from './config/configData';
import HtmlWriter from './writer/htmlWriter';

export async function document(configPath: string) {
  const config = new ConfigData();
  await config.load(configPath);
  const writer = new HtmlWriter();
  const result = await writer.writeRoute({
    global: {
      classPrefix: 'routedoc--',
    },
    style: config.style,
    name: '/api',
    method: [
      {
        verb: 'GET',
        description: 'Get api data',
        responseType: 'application/json',
        responseParameters: [
          {
            key: 'foo',
            description: 'Foo foo',
            type: 'string',
          },
          {
            key: 'bar',
            description: 'Bar bar',
            type: 'int',
            restrictions: '[0<=n<100]',
          },
        ],
      },
    ],
  });

  await fs.writeFile(path.join(config.outputDir, 'result.html'), result);
}

const parser = new ArgumentParser();

parser.add_argument('-c', '--config', { help: 'Set config file', default: 'yamlroutedocumenter.config.yml' });

const args = parser.parse_args();
document(args.config);
