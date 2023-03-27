import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDto } from 'src/app/models/userDto';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css']
})
export class AddUserModalComponent implements OnInit {

  user: UserDto = new UserDto();

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
          title: 'Cont adaugat cu succes!',
          showConfirmButton: false,
          timer: 1500
        })
      }, 
      (error) => {
        console.log(error); 
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Adaugarea contului a esuat!',
          
        })
      }
    )
  }
}
