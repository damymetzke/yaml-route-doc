export interface GlobalData
{
    classPrefix?: string;
}

export interface ParameterData
{
    key: string;
    description: string;
    type: string;
    restrictions?: string;
}

export interface MethodData
{
    verb: 'GET'|'HEAD'|'POST'|'PUT'|'DELETE'|'CONNECT'|'OPTIONS'|'TRACE'|'PATCH';
    description: string;

    requestType?: string;
    requestParameters?: ParameterData[];
    responseType: string;
    responseParameters?: ParameterData[];
}

export interface RouteData
{
    global: GlobalData;
    style: string;
    name: string;
    method: MethodData[];
}
