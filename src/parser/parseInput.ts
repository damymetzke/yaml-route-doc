import { promises as fs } from "fs";
import * as path from "path";
import * as yaml from "yaml";
import marked from "marked";
import {
  MethodData,
  ParameterData,
  RouteData,
  AllData,
  GroupData,
} from "../data";

function parameterMapFunction(parameter: ParameterData): ParameterData {
  return {
    ...parameter,
    description: marked(parameter.description),
  };
}

function routeOrGroupSortFunction(
  a: RouteData | GroupData,
  b: RouteData | GroupData
): number {
  const nameA = a.name.split("/");
  const nameB = b.name.split("/");

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
): Promise<Omit<AllData, "global">> {
  const files = await fs.readdir(inputDirectory);
  const results: Partial<Omit<AllData, "global">>[] = await Promise.all(
    files.map(async (file) => {
      if ((await fs.stat(path.join(inputDirectory, file))).isDirectory()) {
        return parseInput(path.join(inputDirectory, file));
      }

      const rawData = await fs.readFile(path.join(inputDirectory, file));
      const parsedData = yaml.parse(rawData.toString());
      // todo: validate parsed data

      return {
        routes: (<RouteData[]>parsedData.routes)?.map((route) => ({
          name: route.name,
          method: route?.method.map(
            (method): MethodData => ({
              ...method,
              description: marked(method.description),
              requestParameters: method.requestParameters
                ? method.requestParameters.map(parameterMapFunction)
                : undefined,
              responseParameters: method.responseParameters
                ? method.responseParameters.map(parameterMapFunction)
                : undefined,
            })
          ),
        })),
        groups: <GroupData[]>parsedData.groups,
      };
    })
  );

  const finishedResults = await Promise.all(results);
  const mergedResult = finishedResults.reduce(
    (total: Omit<AllData, "global">, current) => ({
      routes: [...total.routes, ...(current.routes ? current.routes : [])],
      groups: [...total.groups, ...(current.groups ? current.groups : [])],
    }),
    { routes: [], groups: [] }
  );

  mergedResult.routes.sort(routeOrGroupSortFunction);
  mergedResult.groups.sort(routeOrGroupSortFunction);

  mergedResult.routes.forEach((route) => {
    route.method.forEach((method) => {
      const result: any = {};
      mergedResult.groups.forEach((group) => {
        if (route.name < group.name) {
          return;
        }

        if (route.name.slice(0, group.name.length) !== group.name) {
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
