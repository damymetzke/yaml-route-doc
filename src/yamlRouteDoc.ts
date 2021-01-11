#!/usr/bin/env node

import { ArgumentParser } from "argparse";
import prompts from "prompts";
import { promises as fs } from "fs";
import * as fsExtra from "fs-extra";
import * as yaml from "yaml";
import * as path from "path";
import { document } from "./index";

async function init(args: any) {
  const location =
    args.initRoot !== ""
      ? { root: args.initRoot }
      : await prompts({
          type: "text",
          name: "root",
          message: "Where should the root of the route documentation be?",
        });
  await fs.mkdir(location.root, {
    recursive: true,
  });

  await Promise.all([
    fs.writeFile(
      path.join(location.root, "config.yml"),
      yaml.stringify({
        routesDir: "data",
        outputDir: "output",
        style: "style/style.scss",
        templates: "template",
        partials: "template/partials",
      })
    ),
    fsExtra.copy(
      path.join(__dirname, "../resource/html/default"),
      path.join(location.root, "template")
    ),
    fsExtra.copy(
      path.join(__dirname, "../resource/style/default"),
      path.join(location.root, "style")
    ),
    fsExtra.copy(
      path.join(__dirname, "../resource/data/dummy"),
      path.join(location.root, "data")
    ),
  ]);

  process.exit(0);
}

const parser = new ArgumentParser();

parser.add_argument("-c", "--config", {
  help: "Set config file",
  default: "yamlroutedocumenter.config.yml",
});
parser.add_argument("-i", "--init", {
  help: "Initialize project",
  action: "store_true",
});
parser.add_argument("--initRoot", {
  help: "Set root for initializations.\nRequires --init to be specified",
  default: "",
});

const args = parser.parse_args();

if (args.init) {
  init(args);
} else {
  document(args.config);
}
