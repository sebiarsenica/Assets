import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private response:any;

  constructor(private cookieService: CookieService, private router:Router) { }

  storeToken(response: any, expiresInMinutes: number) { 
     this.response = response;
     const expireDate = new Date(); 
     expireDate.setTime(expireDate.getTime()+ (expiresInMinutes*60*1000));
     this.cookieService.set('acces-token', JSON.stringify(response), expireDate);
     
  }

  logOut(): any{ 
    this.response = null; 
    this.cookieService.delete('acces-token'); 
    location.reload();
  }

  checkTokenExists(): boolean{
    return this.cookieService.check('acces-token');
  }
}
