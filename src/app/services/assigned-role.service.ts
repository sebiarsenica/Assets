import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { assignedRole } from '../models/assignedRole';
import { environment } from 'src/environments/environment';
import { assignRoleDto } from '../models/assignRoleDto';

@Injectable({
  providedIn: 'root'
})
export class AssignedRoleService {
  private url = "AssignedRoles";
  
  constructor(private http: HttpClient) { }

  public getAll():Observable<assignedRole[]>{
    return this.http.get<assignedRole[]>(environment.apiUrl+'/'+this.url);
  }

  public getAssignedRolesForUser(id: any):Observable<assignedRole[]>{
    return this.http.get<assignedRole[]>(environment.apiUrl+'/'+this.url+'/'+id);
  }

  public AssignRolesToUser(arole : assignRoleDto):Observable<boolean>{
    return this.http.post<boolean>(environment.apiUrl+'/'+this.url, arole);
  }

  public DeleteAssignRoleToUser(arole: assignRoleDto):Observable<boolean>{
    return this.http.delete<boolean>(environment.apiUrl+'/'+this.url+'/'+arole.RoleId+'/'+arole.UserId);
  }
  
}
