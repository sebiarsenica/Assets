import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from './services/auth-service.service';
import { UsersComponent } from './components/users/users.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Assets';
  
  constructor(private router: Router, private authService: AuthServiceService) { 
    if(this.authService.checkTokenExists()) 
    this.router.navigate(['/main']);
    else
    this.router.navigate(['/login']);

    
  }

  shouldDisplayNavbar() {
    return this.router.url !== '/login';
  }
  
  
}
