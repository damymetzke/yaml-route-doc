#!/usr/bin/env node

import { ArgumentParser } from 'argparse';
import prompts from 'prompts';
import { promises as fs } from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';
import { document } from './index';

async function init() {
  const location = await prompts({
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
    fs.copyFile(path.join(__dirname, '../resource/style/default.css'), path.join(location.root, 'styles/style.css')),
  ]);

  process.exit(0);
}

const parser = new ArgumentParser();

parser.add_argument('-c', '--config', { help: 'Set config file', default: 'yamlroutedocumenter.config.yml' });
parser.add_argument('-i', '--init', { help: 'Initialize project', action: 'store_true' });

const args = parser.parse_args();

if (args.init) {
  init();
} else {
  document(args.config);
}
