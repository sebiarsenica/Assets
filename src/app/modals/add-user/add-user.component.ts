import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDto } from 'src/app/models/userDto';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserModalComponent implements OnInit {

  user: UserDto = new UserDto();

  showUsernameInfo = false;
  showFullNameInfo = false;
  showEmailInfo = false;


  constructor(private userService : UserService, private router : Router) { }

  ngOnInit(): void {
  }

  addUser(){
    this.userService.registerUser(this.user).subscribe(
      (response) => {
         this.router.navigate(['/users'])
         Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Account added!',
          showConfirmButton: false,
          timer: 900,
          background: '#f8f9fa',
          backdrop: 'transparent'
        })
      }, 
      (error) => {
        console.log(error); 
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Adding the account failed for some reason!',
          
        })
      }
    )
  }

  isFormValid(): boolean {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const fullnameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)+$/;
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    const isUsernameValid = usernameRegex.test(this.user.username);
    const isFullNameValid = fullnameRegex.test(this.user.fullname);
    const isEmailValid = emailRegex.test(this.user.email.toLowerCase());

    return isUsernameValid && isFullNameValid && isEmailValid && !!this.user.password;
  }

  isUsernameValid(): boolean{
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const isUsernameValid = usernameRegex.test(this.user.username);

    return isUsernameValid;
  }

  isFullNameValid(): boolean {
    const fullnameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)+$/;
    const isFullNameValid = fullnameRegex.test(this.user.fullname);
  
    return isFullNameValid;
  }
  
  isEmailValid(): boolean{
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const isEmailValid = emailRegex.test(this.user.email.toLowerCase());

    return isEmailValid;
  }

  Cancel(){
    this.router.navigate(['/users'])
  }
}
