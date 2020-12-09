import GlobalData from './globalData';
import MethodData from './methodData';

export default interface RouteData
{
    global: GlobalData;
    name: string;
    method: MethodData[];
}
