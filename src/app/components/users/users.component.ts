import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { assignedRole } from 'src/app/models/assignedRole';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  userRoles : string = "";
  users: any[] = [];
  unsortedUsers : User[] = [];
  selectedUsers: any[] = [];
  filter: string = '';
  sortOrderId : string = "";
  sortOrderUsername: string = ""; 
  sortOrderFullName : string = ""; 
  sortOrderEmail : string = "";

  constructor(private userService: UserService, private router: Router, private authService: AuthServiceService) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.userRoles = this.authService.getRoles();
    console.log(this.userRoles);
    }

  //Routing
  addUser(){ 
    this.router.navigate(['/addUser']);
  }

  editUser(){
    let navigationsExtras: NavigationExtras = { 
      state: { 
        user: this.selectedUsers,
        userRoles: this.userRoles
      }
    };
    this.router.navigate(['/editUser'], navigationsExtras);
  }

  //End of routing

  getAllUsers(){ 
   this.userService.getUsers().subscribe(
    (response)=>{
     this.users = response;
     this.unsortedUsers = response;
     this.formatUserCreateDate();
    },
    (error) => { 
      Swal.fire({
        icon: 'error',
        title: 'Error loading the users',
       });
       console.log(error);
    }
   )
  }
 deleteUser(){
    let nr = 0; 
    console.log("intra aici");
    for(var i = 0 ; i < this.selectedUsers.length; i++)
    this.userService.deleteUser(this.selectedUsers[i].id).subscribe(
      (response)=>{
        this.users = response; 
         nr++;
        if(nr === this.selectedUsers.length-1) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Conturile au fost sterse cu succes!',
            showConfirmButton: false,
            timer: 900
          })
           this.selectedUsers.splice(0, this.selectedUsers.length);
          }
      }, 
      (error)=>{
        console.log(error); 
        Swal.fire({
          icon: 'error',
          title: 'Error deleting user'
        })
      }
    )


   
  }

  formatUserCreateDate() { 
    for (let user of this.users) {
      const createDate = user.createDate;
      if (createDate && createDate instanceof Date) { // Check if createDate is a valid Date object
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
  
applyFilter():void{
  let filterValue = this.filter.toLowerCase();

  if(filterValue === "") 
  {this.users = this.unsortedUsers;
  return;}

  this.users = this.users.filter((user)=>{
    return(
      user.id?.toString().includes(filterValue)||
      user.username?.toLowerCase().includes(filterValue)||
      user.fullName?.toLowerCase().includes(filterValue)||
      user.email?.toLowerCase().includes(filterValue)||
      user.createDate?.toString().includes(filterValue)
    );
  });
}

sortUserList(field: string): void {
  this.users.sort((a, b) => {
    if (a[field] < b[field]) {
      return -1;
    }
    if (a[field] > b[field]) {
      return 1;
    }
    return 0;
  });

  // Toggle sort order for id
  if(field === "id"){
  if (this.sortOrderId === 'asc') {
    this.sortOrderId = 'desc';
    this.users.reverse();  
  } else {
    this.sortOrderId = 'asc';
    this.sortOrderUsername = "";
    this.sortOrderFullName = "";
    this.sortOrderEmail = "";
  }
}

  if(field === "username"){
  if (  this.sortOrderUsername === 'asc') {
    this.sortOrderUsername = 'desc';
    this.users.reverse();
  } else {
    this.sortOrderUsername = 'asc';
    this.sortOrderId = "";
    this.sortOrderFullName = "";
    this.sortOrderEmail = "";
  }
}

if(field === 'fullname'){
  if (  this.sortOrderFullName=== 'asc') {
    this.sortOrderFullName = 'desc';
    this.users.reverse();
  } else {
    this.sortOrderFullName = 'asc';
    this.sortOrderId = "";
    this.sortOrderUsername = "";
    this.sortOrderEmail = "";
  }
}

if(field === 'email'){
  if (  this.sortOrderEmail== 'asc') {
    this.sortOrderEmail = 'desc';
    this.users.reverse();
  } else {
    this.sortOrderEmail = 'asc';
    this.sortOrderId = "";
    this.sortOrderUsername = "";
    this.sortOrderFullName = "";
  }
}


}

}
