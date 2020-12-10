import { GroupData, AllData, GlobalData, RouteData } from "../data";

export default interface IWriter {
  writeIndex(data: AllData): Promise<string>;
  writeRoute(data: RouteData, global: GlobalData): Promise<string>;
  writeGroup(data: GroupData, global: GlobalData): Promise<string>;
}
