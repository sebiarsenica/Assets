import { role } from "./role";
import { User } from "./user";

export class assignedRole{
    id: number | undefined; 
    user: User | undefined; 
    role: role | undefined;
}