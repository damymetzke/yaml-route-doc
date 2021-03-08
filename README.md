# YAML Route Documenter

[![Build and Run Tests](https://github.com/damymetzke/yaml-route-doc/workflows/Build%20and%20Run%20Tests/badge.svg?branch=master)](https://github.com/damymetzke/yaml-route-doc/actions?query=workflow%3A%22Build+and+Run+Tests%22)
[![ESLint](https://github.com/damymetzke/yaml-route-doc/workflows/ESLint/badge.svg?branch=master)](https://github.com/damymetzke/yaml-route-doc/actions?query=workflow%3AESLint)
[![Prettier](https://github.com/damymetzke/yaml-route-doc/workflows/Prettier/badge.svg?branch=master)](https://github.com/damymetzke/yaml-route-doc/actions?query=workflow%3APrettier)

The main purpose of this package is:

1. YAML in
2. HTML out

Routes can either be documented for internal use, or for third parties (e.g. when documenting a REST API).

## Quick start

Run the following commands:

```bash
> npm i -D yaml-route-documenter
> npx yaml-route-documenter --install
    # Follow the instructions given by the install tool
```

**Please make sure you add the output folder to your `.gitignore` or equivalent.**
**By default this will be `{root}/output`.**

To generate the HTML use the command:

```bash
> npx yaml-route-documenter -c $PathToConfig
> yaml-route-documenter -c $PathToConfig # Drop the 'npx' when defining it as an npm script
```

Alternatively call it programmatically:

```ts
import * as documenter from "yaml-route-doc";

documenter.document("path/to/config.yml");
```

## More Documentation

For more information about writing custom CSS please refer to the [CSS Guide](./doc/cssGuide.md)
