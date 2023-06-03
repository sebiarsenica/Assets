import { User } from "./user";
import {asset} from "./asset";
export class assignedAsset{ 
    id : number | undefined; 
    user: User | undefined;
    asset: asset | undefined; 
    assignedDate : Date | undefined; 
    expireDate : Date | undefined; 
    status : string | undefined;
}