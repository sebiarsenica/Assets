import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { assignRoleDto } from 'src/app/models/assignRoleDto';
import { assignedRole } from 'src/app/models/assignedRole';
import { User } from 'src/app/models/user';
import { UserDto } from 'src/app/models/userDto';
import { AssignedRoleService } from 'src/app/services/assigned-role.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
currentUserRoles: string = "";
selectedUsers : any[] = [];
selectedUser : User = new User();
aRole : assignedRole = new assignedRole();
tempARD : assignRoleDto = new assignRoleDto();
password : string = "";
userToSend : UserDto = new UserDto();

//These are all the roles 
availableRoles: any[] =[];
selectedRoles:any[] = [];

//These are the roles the current user has
userRolesBeforeAddRemove: any[] = [];
userRoles:any[] = [];
selectedUserRoles:any[] = [];

 

  constructor(private route: ActivatedRoute, private userService : UserService, private roleService:RoleService,private assignedRoleService: AssignedRoleService, private router: Router) { }

  ngOnInit(): void {
    this.selectedUsers = history.state.user;
    this.selectedUser = this.selectedUsers[0];
    this.currentUserRoles = history.state.userRoles;
    console.log(this.currentUserRoles);
    this.getAllRoles();
    this.getAllAssignedRolesForUser();
   
  }

  getAllRoles(){
    this.roleService.getRoles(this.selectedUser.id).subscribe(
      (response)=>{
        this.availableRoles = response; 
      },
      (error)=>{
        Swal.fire({
          icon: 'error', 
          title: 'Error getting roles'
        });
        console.log(error);
      }
    )
  }

  getAllAssignedRolesForUser(){
    this.assignedRoleService.getAssignedRolesForUser(this.selectedUser.id).subscribe(
      (response)=>{
        this.userRoles = response.slice();
        this.userRolesBeforeAddRemove = response.slice();
       },
      (error)=>{
        console.log(error);
      }
    );
  }

  editUser(): void{ 
    this.userToSend.username = this.selectedUser.username ?? "";
    this.userToSend.fullname = this.selectedUser.fullName ?? ""; 
    this.userToSend.email = this.selectedUser.email??"";
    this.userToSend.password = this.password;
    console.log(this.selectedUser.id);
    this.userService.editUser(this.userToSend, this.selectedUser.id).subscribe( 
      (response)=>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cont editat cu succes!',
          showConfirmButton: false,
          timer: 900,
          background: '#f8f9fa',
          backdrop: 'transparent'
        })
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Eroare la editare'
        })
        console.log("Error in editing user : " + error);
      }
    )
  }

  onRoleSelect(role: any){
    const index = this.selectedRoles.indexOf(role); 
    if(index >= 0){ 
      this.selectedRoles.splice(index, 1);
    }else{
      this.selectedRoles.push(role);
    }
  }

  isRoleSelected(role: any){
    return this.selectedRoles.indexOf(role) >= 0;
  }

  onUserRoleSelect(role: any){
    const index = this.selectedUserRoles.indexOf(role); 
    if(index >= 0){
      this.selectedUserRoles.splice(index, 1);
    }else{
      this.selectedUserRoles.push(role);
    }
  }

  isUserRoleSelected(role: any){
  return this.selectedUserRoles.indexOf(role) >= 0;
 }

  addRole():void{
  for(let i = 0 ; i<this.selectedRoles.length;i++)
  { 
    this.aRole.role = this.selectedRoles[i];
    this.aRole.user = this.selectedUser;
    
    this.userRoles.push(this.aRole); 
    const index = this.availableRoles.indexOf(this.selectedRoles[i]);
    this.availableRoles.splice(index,1);

    this.aRole = new assignedRole();
  }
  this.selectedRoles.splice(0, this.selectedRoles.length);
  
  }

  removeRole():void{
   for(let i = 0 ; i<this.selectedUserRoles.length; i++)
   {
    this.availableRoles.push(this.selectedUserRoles[i].role);
    const index = this.userRoles.indexOf(this.selectedUserRoles[i]);
    this.userRoles.splice(index,1);
   }
   this.selectedUserRoles.splice(0,this.selectedUserRoles.length);
  }

  saveRole():void{
   
    const rolesToBeDeleted = this.userRolesBeforeAddRemove.filter(role => !this.userRoles.includes(role));
    
    for(let i = 0; i< rolesToBeDeleted.length; i++)
    {
       this.tempARD.RoleId = rolesToBeDeleted[i].role.id;
       this.tempARD.UserId = rolesToBeDeleted[i].user.id;
       this.assignedRoleService.DeleteAssignRoleToUser(this.tempARD).subscribe(
        (response)=>{
          console.log(response);
        },
        (error)=>{
          console.log(error);
        }
       )
       this.tempARD = new assignRoleDto();
    }
  
    const rolesToBeAdded = this.userRoles.filter(role => !this.userRolesBeforeAddRemove.includes(role));
   
    for(let i = 0; i<rolesToBeAdded.length;i++)
    {
       this.tempARD.RoleId = rolesToBeAdded[i].role.id; 
       this.tempARD.UserId = rolesToBeAdded[i].user.id;
       this.assignedRoleService.AssignRolesToUser(this.tempARD).subscribe(
        (response)=> {
          console.log(response);
        }, 
        (error)=>{
          console.log(error);
        }
       )
       this.tempARD = new assignRoleDto();
     }

    location.reload();
  
  }

 

}
