# YAML Route Documenter

The main purpose of this package is:

1. YAML in
2. HTML out

Routes can either be documented for internal use,
or for thrid parties (e.g. when documenting a rest api).

## Quick start

Run the following commands:

```bash
> npm i -D yaml-route-documenter
> npx yaml-route-documenter --install
```

This will create a config file in the root directory called `yamlroutedocumenter.config.yml`.
To change the location of the config file use the flag `--config=[PathToConfig]`.

To generate the HTML use the command:

```bash
> npx yaml-route-documenter
> npx yaml-route-documenter --config=[PathToConfig] # Custom config path
> yaml-route-documenter # Drop the 'npx' when defining it as a npm script
```

Alternatively call it programmatically:

```ts
import * as documenter from 'yaml-route-documenter';

documenter.document('path/to/config.yml');
```