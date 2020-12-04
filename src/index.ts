import { ArgumentParser } from 'argparse';
import ConfigData from './config/configData';

export async function document(configPath: string) {
  const config = new ConfigData();
  await config.load(configPath);
  console.log(config);
}

const parser = new ArgumentParser();

parser.add_argument('-c', '--config', { help: 'Set config file', default: 'yamlroutedocumenter.config.yml' });

const args = parser.parse_args();
document(args.config);
