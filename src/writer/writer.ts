export default interface IWriter
{
    writeRoute(data: any): Promise<string>;
}
