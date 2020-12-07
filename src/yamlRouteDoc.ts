#!/usr/bin/env node

import { ArgumentParser } from 'argparse';
import { document } from './index';

const parser = new ArgumentParser();

parser.add_argument('-c', '--config', { help: 'Set config file', default: 'yamlroutedocumenter.config.yml' });

const args = parser.parse_args();
document(args.config);
