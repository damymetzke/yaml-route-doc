import RouteData from './routeData';
import GlobalData from './globalData';
import GroupData from './groupData';

export default interface AllData
{
    routes: RouteData[];
    groups: GroupData[];
    global: GlobalData;
}
