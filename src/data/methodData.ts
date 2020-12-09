import ParameterData from './parameterData';

export default interface MethodData
{
    verb: 'GET'|'HEAD'|'POST'|'PUT'|'DELETE'|'CONNECT'|'OPTIONS'|'TRACE'|'PATCH';
    description: string;

    requestType?: string;
    requestParameters?: ParameterData[];
    responseType?: string;
    responseParameters?: ParameterData[];
}
