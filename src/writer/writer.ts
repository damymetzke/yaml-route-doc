export default interface IWriter
{
    writeIndex(data: any): Promise<string>;
    writeRoute(data: any): Promise<string>;
}
