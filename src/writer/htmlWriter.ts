import * as handlebars from 'handlebars';
import * as path from 'path';
import { promises as fs } from 'fs';
import IWriter from './writer';

export default class HtmlWriter implements IWriter {
  async writeRoute(_data: any): Promise<string> {
    const template = handlebars.compile(await (await fs.readFile(path.join(__dirname, '../../resource/htmlTemplate/route.handlebars'))).toString());
    return template({
      routeName: '/api',
      method: [
        {
          methodName: 'GET',
          description: 'Get api data',
          responseType: 'application/json',
          responseData: [
            {
              dataKey: 'foo',
              dataDescription: 'Foo foo',
              dataType: 'string',
            },
            {
              dataKey: 'bar',
              dataDescription: 'Bar bar',
              dataType: 'integer',
              restrictions: '[0<=n<100]',
            },
          ],
        },
      ],
    });
  }
}
