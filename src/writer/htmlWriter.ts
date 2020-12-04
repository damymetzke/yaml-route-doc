import IWriter from './writer';

export default class HtmlWriter implements IWriter {
  writeRoute(_data: any): string {
    return '<div></div>';
  }
}
