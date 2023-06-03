import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MainpageComponent } from './components/mainpage/mainpage.component';
import { CookieService } from 'ngx-cookie-service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UsersComponent } from './components/users/users.component';
import { AddUserModalComponent } from './modals/add-user/add-user.component';
import { EditUserComponent } from './modals/edit-user/edit-user.component';
import { AnimatedBackgroundComponent } from './components/animated-background/animated-background.component';
import { AssetsComponent } from './components/assets/assets.component';
import { AddAssetComponent } from './modals/add-asset/add-asset.component';
import { EditAssetComponent } from './modals/edit-asset/edit-asset.component';
import { AssignAssetComponent } from './components/assign-asset/assign-asset.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainpageComponent,
    NavbarComponent,
    UsersComponent,
    AddUserModalComponent,
    EditUserComponent,
    AnimatedBackgroundComponent,
    AssetsComponent,
    AddAssetComponent,
    EditAssetComponent,
    AssignAssetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
   
  ],
  providers: [CookieService,{ provide: LOCALE_ID, useValue: 'en-US' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
