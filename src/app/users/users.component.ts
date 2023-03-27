import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  selectedUsers: any[] = [];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getAllUsers();
    
  }

  //Routing
  addUser(){ 
    this.router.navigate(['/addUser']);
  }

  editUser(){
    let navigationsExtras: NavigationExtras = { 
      state: { 
        user: this.selectedUsers
      }
    };
    this.router.navigate(['/editUser'], navigationsExtras);
  }

  //End of routing

  getAllUsers(){ 
   this.userService.getUsers().subscribe(
    (response)=>{
     
     this.users = response;
     this.formatUserCreateDate();
    },
    (error) => { 
      Swal.fire({
        icon: 'error',
        title: 'Error loading the users',
       })
    }
   )
  }

  deleteUser(){
    for(var i = 0 ; i < this.selectedUsers.length; i++)
    this.userService.deleteUser(this.selectedUsers[i].id).subscribe(
      (response)=>{
        this.users = response; 
        this.formatUserCreateDate();
      }, 
      (error)=>{
        console.log(error); 
        Swal.fire({
          icon: 'error',
          title: 'Error deleting user'
        })
      }
    )

    this.selectedUsers.splice(0, this.selectedUsers.length);
  }

  formatUserCreateDate() { 
    for (let user of this.users) {
      const createDate = user.createDate;
      if (createDate) {
        const formattedCreateDate = createDate.toLocaleDateString();
        const newCreateDate = new Date(formattedCreateDate);
        user.createDate = newCreateDate;
      }
    }
  }

  onSelect(user: any) {
    const index = this.selectedUsers.indexOf(user);
    if (index >= 0) {
        this.selectedUsers.splice(index, 1);
    } else {
        this.selectedUsers.push(user);
    }

    
}

isSelected(user: any){
      return this.selectedUsers.indexOf(user) >= 0;
}
 
returnSelectedUsersCount() : number { 
  return this.selectedUsers.length;
}
  


}
