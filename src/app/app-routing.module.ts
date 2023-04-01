import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainpageComponent } from './components/mainpage/mainpage.component';
import { AppComponent } from './app.component';
import { UsersComponent } from './components/users/users.component';
import { AddUserModalComponent } from './modals/add-user/add-user.component';
import { EditUserComponent } from './modals/edit-user/edit-user.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainpageComponent},
  {path: 'users', component: UsersComponent},
  {path: 'addUser', component: AddUserModalComponent},
  {path: 'editUser', component: EditUserComponent},
  {path: '', redirectTo: 'AppComponent', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
