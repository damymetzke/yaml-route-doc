import { promises as fs } from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import marked from 'marked';
import {
  MethodData, ParameterData, RouteData, AllData, GroupData,
} from '../data';

function parameterMapFunction(parameter: ParameterData): ParameterData {
  return {
    ...parameter,
    description: marked(parameter.description),
  };
}

export default async function parseInput(inputDirectory: string): Promise<Omit<AllData, 'global'>> {
  const files = await fs.readdir(inputDirectory);
  const results: Partial<Omit<AllData, 'global'>>[] = await Promise.all(files.map(async (file) => {
    if ((await fs.stat(path.join(inputDirectory, file))).isDirectory()) {
      return parseInput(path.join(inputDirectory, file));
    }

    const rawData = await fs.readFile(path.join(inputDirectory, file));
    const parsedData = yaml.parse(rawData.toString());
    // todo: validate parsed data

    return {
      routes: (<RouteData[]>parsedData.routes)?.map((route) => ({
        name: route.name,
        method: route?.method.map((method): MethodData => ({
          ...method,
          description: marked(method.description),
          requestParameters: method.requestParameters
            ? method.requestParameters.map(parameterMapFunction)
            : undefined,
          responseParameters: method.responseParameters
            ? method.responseParameters.map(parameterMapFunction)
            : undefined,
        })),
      })),
      groups: <GroupData[]>parsedData.groups,
    };
  }));

  const finishedResults = await Promise.all(results);
  return finishedResults
    .reduce((total: Omit<AllData, 'global'>, current) => ({
      routes: [...total.routes, ...(current.routes ? current.routes : [])],
      groups: [...total.groups, ...(current.groups ? current.groups : [])],
    }),
    { routes: [], groups: [] });
}
