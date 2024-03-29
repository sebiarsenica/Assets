import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDto } from '../../models/userDto';
import { UserService } from '../../services/user.service';
import { AuthServiceService } from '../../services/auth-service.service';
import Swal from 'sweetalert2';
import { AssignedRoleService } from 'src/app/services/assigned-role.service';



@Component({ 
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
 
})
export class LoginComponent implements OnInit {
  user: UserDto = new UserDto();
  
  
  constructor(private router: Router, private userService : UserService, private authService: AuthServiceService, private assignRolesToUserService: AssignedRoleService) { }
  

  ngOnInit(): void {
    
  }

  onSubmit() {
    
    this.userService.loginUser(this.user).subscribe(
      (response) => {
       this.authService.storeToken(response,this.user.username,400);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Login succes!',
          showConfirmButton: false,
          timer: 1000
        })
        this.router.navigate(['/main']); 
        },
      (error) => {
        console.error('Login error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Username or password wrong',
         })
      }
    );
    
    
  }

 

}
