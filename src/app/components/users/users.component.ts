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

  page: number = 1; 
  pageSize: number = 5;

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
            title: 'Accounts were deleted!',
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

//Pagination
getPaginatedData() {
  var startIndex = (this.page - 1) * +this.pageSize;
  var endIndex = startIndex + +this.pageSize;
  var currentPageItems = this.users.slice(startIndex, endIndex);

  // If the current page has fewer items than the page size, use its length to calculate the start index
  var firstItemIndex = Math.min(startIndex, this.users.length - currentPageItems.length);
  return this.users.slice(firstItemIndex, firstItemIndex + +this.pageSize);
}

get totalPages(): number {
  return Math.ceil(this.users.length / this.pageSize);
}

onPageSizeChange(){
  this.page = 1;
}

//End of pagination


}
