import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AssignedRoleService } from './assigned-role.service';
import { assignedRole } from '../models/assignedRole';
import { User } from '../models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  aRoles: assignedRole[] = [];
  user: User = new User();
  roles: string = "";

  private response:any;

  constructor(private cookieService: CookieService, private userService:UserService, private router:Router, private assignRoleService : AssignedRoleService) { }

  storeToken(response: any, username : string ,expiresInMinutes: number) { 
     this.response = response;
     const expireDate = new Date(); 
     expireDate.setTime(expireDate.getTime()+ (expiresInMinutes*60*1000));
     this.cookieService.set('acces-token', JSON.stringify(response), expireDate);
     this.cookieService.set('username',username,expireDate);
     this.getUser();
     this.roles = "";
  }

  logOut(): any{ 
    this.response = null; 
    this.cookieService.delete('acces-token'); 
    location.reload();
  }

  checkTokenExists(): boolean{
    return this.cookieService.check('acces-token');
  }

  getUser(): void{
  this.userService.getUserByUserName(this.cookieService.get('username')).subscribe(
    (response)=>{
      this.user = response;
      this.getRolesForUser();
    }, 
    (error)=>{
      console.log(error);
    }
  );
  
  }

  getUserNameFromCookie():string{
    return this.cookieService.get('username');
  }

  getRolesForUser():void{
  this.assignRoleService.getAssignedRolesForUser(this.user.id).subscribe(
    (response)=>{
      this.aRoles = response;
      this.formatRoles();
    },
    (error)=>{
      console.log(error);
    }
  );
  }

  formatRoles():void{
    this.aRoles.forEach(role => this.roles+= role.role?.roleName+"; ");
   
  }

  getRoles(): string{
    return this.roles;
  }
}
