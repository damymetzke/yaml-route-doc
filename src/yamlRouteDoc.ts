#!/usr/bin/env node

import { ArgumentParser } from 'argparse';
import prompts from 'prompts';
import { promises as fs } from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';
import { document } from './index';

async function init(args: any) {
  console.log(args);
  const location = args.initRoot !== ''
    ? { root: args.initRoot }
    : await prompts({
      type: 'text',
      name: 'root',
      message: 'Where should the root of the route documentation be?',
    });
  await fs.mkdir(path.join(location.root, 'templates/partials'), { recursive: true });
  await fs.mkdir(path.join(location.root, 'routes'));
  await fs.mkdir(path.join(location.root, 'styles'));

  await Promise.all([
    fs.writeFile(
      path.join(location.root, 'config.yml'),
      yaml.stringify({
        routesDir: 'routes',
        outputDir: 'output',
        style: 'styles/style.css',
        templates: 'templates',
        partials: 'templates/partials',
      }),
    ),
    fs.copyFile(path.join(__dirname, '../resource/htmlTemplate/route.handlebars'), path.join(location.root, 'templates/route.handlebars')),
    fs.copyFile(path.join(__dirname, '../resource/htmlTemplate/index.handlebars'), path.join(location.root, 'templates/index.handlebars')),
    fs.copyFile(path.join(__dirname, '../resource/htmlTemplate/routeParameter.handlebars'), path.join(location.root, 'templates/partials/routeParameter.handlebars')),
    fs.copyFile(path.join(__dirname, '../resource/style/default.scss'), path.join(location.root, 'styles/style.scss')),
    ...(await fs.readdir(path.join(__dirname, '../resource/dummy'))).map((file) => fs.copyFile(path.join(__dirname, '../resource/dummy', file), path.join(location.root, 'routes', file))),
  ]);

  process.exit(0);
}

const parser = new ArgumentParser();

parser.add_argument('-c', '--config', { help: 'Set config file', default: 'yamlroutedocumenter.config.yml' });
parser.add_argument('-i', '--init', { help: 'Initialize project', action: 'store_true' });
parser.add_argument('--initRoot', { help: 'Set root for initializations.\nRequires --init to be specified', default: '' });

const args = parser.parse_args();

if (args.init) {
  init(args);
} else {
  document(args.config);
}
