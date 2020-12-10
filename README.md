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

## Understanding the structure

By default all files related to route documentation are collected under a single 'root' folder.
However, all sub-folders are defined in the config file.
You can freely rename the folders, or even move them elsewhere.
Be default the following folders exists:

- `/output`; The output when generating the HTML.
  `/output/index.html` is considered to be the entry point.
- `/routes`; The primary input when generating the HTML.
  This contains YAML formatted data for all routes.
- `/styles`; Holds the css sheet.
  In the future sass might be supported here.
  The defined function, `/styles/style.css` by default, will be included in the generated output.
- `templates`; Holds the HTML templates used to generate the output.
  Templates use [Handlebars](https://handlebarsjs.com).
  The files **are** required to have specific names.
- `templates/partials`;
  These will be registered as [handlebars partials](https://handlebarsjs.com/guide/#partials).
  Simply put these are reusable templates that can be included in other templates.
  The name you should use in other templates is the same as the name of the file.
  So to use the partial `myPartial.handlebars`, you write `{{>myPartial}}`.

### Editing the files

If all you care about is the routes you just have to be concerned about the `/routes` directory.
However you might want to have more control over the style, or structure of the output.
Here are some things you could do:

- Change the color scheme to fit your project or company.
- Add links to some other bigger index page in the route-doc index page.
  This way you could link different documentation generators.
- Add scripted functionality, such as dropdowns or a search bar.
- Add some text to the index page.
