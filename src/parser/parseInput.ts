import { promises as fs } from "fs";
import * as path from "path";
import * as yaml from "yaml";

function routeOrGroupSortFunction(a: unknown, b: unknown): number {
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null ||
    !("name" in a) ||
    !("name" in b)
  ) {
    return -1;
  }
  const nameA = (<any>a).name.split("/");
  const nameB = (<any>b).name.split("/");

  for (let i = 0; i < Math.min(nameA.length, nameB.length); ++i) {
    if (nameA[i] === nameB[i]) {
      continue;
    }

    return nameA[i] < nameB[i] ? -1 : 1;
  }

  return nameA.length - nameB.length;
}

export default async function parseInput(
  inputDirectory: string
): Promise<{ routes: unknown[]; groups: unknown[] }> {
  const files = await fs.readdir(inputDirectory);
  const results: { routes: unknown[]; groups: unknown[] }[] = await Promise.all(
    files.map(async (file) => {
      if ((await fs.stat(path.join(inputDirectory, file))).isDirectory()) {
        return parseInput(path.join(inputDirectory, file));
      }

      const rawData = await fs.readFile(path.join(inputDirectory, file));
      const parsedData = yaml.parse(rawData.toString());

      return {
        routes: parsedData.routes,
        groups: parsedData.groups,
      };
    })
  );

  const mergedResult = results.reduce(
    (total: { routes: unknown[]; groups: unknown[] }, current) => ({
      routes: [...total.routes, ...(current.routes ? current.routes : [])],
      groups: [...total.groups, ...(current.groups ? current.groups : [])],
    }),
    { routes: [], groups: [] }
  );

  mergedResult.routes.sort(routeOrGroupSortFunction);
  mergedResult.groups.sort(routeOrGroupSortFunction);

  mergedResult.routes.forEach((route) => {
    if (
      typeof route !== "object" ||
      route === null ||
      !("method" in route) ||
      !Array.isArray((<any>route).method) ||
      typeof (<any>route).name !== "string"
    ) {
      return;
    }

    (<any>route).method.forEach((method: any) => {
      if (typeof method !== "object" || method === null) {
        return;
      }

      const result: any = {};
      mergedResult.groups.forEach((group: any) => {
        if (
          typeof group !== "object" ||
          group === null ||
          typeof group.name !== "string" ||
          typeof group.variables !== "object" ||
          group.variables === null
        ) {
          return;
        }

        if (
          (<string>(<any>route).name).length <
          (<string>(<any>group).name).length
        ) {
          return;
        }

        if (
          (<string>(<any>route).name).slice(
            0,
            (<string>(<any>route).name).length
          ) !== <string>(<any>route).name
        ) {
          return;
        }

        Object.entries(group.variables).forEach(([key, value]) => {
          if (value === undefined) {
            return;
          }
          result[key] = value;
        });
      });

      if (method.requestType === undefined) {
        method.requestType = result.requestType;
      }
      if (method.responseType === undefined) {
        method.responseType = result.responseType;
      }
      if (method.auth === undefined) {
        method.auth = result.auth;
      }
      if (method.role === undefined) {
        method.role = result.role;
      }
    });
  });

  return mergedResult;
}
