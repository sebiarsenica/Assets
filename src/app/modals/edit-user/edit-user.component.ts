import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserDto } from 'src/app/models/userDto';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
selectedUsers : any[] = [];
selectedUser : User = new User();
password : string = "";
userToSend : UserDto = new UserDto();

availableRoles: any[] =[];
userRoles:any[] = [];


  constructor(private route: ActivatedRoute, private userService : UserService, private router: Router) { }

  ngOnInit(): void {
    this.selectedUsers = history.state.user;
    this.selectedUser = this.selectedUsers[0];
    this.availableRoles.push("test1");
    this.availableRoles.push("test2");
    this.userRoles.push("test3");
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

  addRole():void{

  }

  removeRole():void{

  }

  drop() {
    
  }

}
