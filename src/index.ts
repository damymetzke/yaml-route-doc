import { ArgumentParser } from 'argparse';
import ConfigData from './config/configData';
import HtmlWriter from './writer/htmlWriter';

export async function document(configPath: string) {
  const config = new ConfigData();
  await config.load(configPath);
  const writer = new HtmlWriter();
  console.log(await writer.writeRoute({}));
}

const parser = new ArgumentParser();

parser.add_argument('-c', '--config', { help: 'Set config file', default: 'yamlroutedocumenter.config.yml' });

const args = parser.parse_args();
document(args.config);
