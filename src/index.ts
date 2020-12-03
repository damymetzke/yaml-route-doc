import ConfigData from './config/configData';

export async function document() {
  const config = new ConfigData();
  await config.load('sandbox/config.yml');
  console.log(config);
}

document();
