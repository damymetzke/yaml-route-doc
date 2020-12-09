import MethodData from './methodData';

export default interface GroupData{
    name: string;
    description: string;
    variables: Pick<MethodData, 'requestType' | 'responseType'>
}
