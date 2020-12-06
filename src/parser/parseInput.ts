import { promises as fs } from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { RouteData } from '../data/routeData';

export default async function parseInput(inputDirectory: string): Promise<RouteData[]> {
  const files = await fs.readdir(inputDirectory);
  const results = await files.map(async (file) => {
    if ((await fs.stat(path.join(inputDirectory, file))).isDirectory()) {
      return parseInput(path.join(inputDirectory, file));
    }

    const rawData = await fs.readFile(path.join(inputDirectory, file));
    const parsedData = yaml.parse(rawData.toString());
    // todo: validate parsed data
    return <RouteData[]>(parsedData.routes);
  });

  const finishedResults = await Promise.all(results);
  return finishedResults.reduce((total, current) => [...total, ...current], []);
}
