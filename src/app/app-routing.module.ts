import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainpageComponent } from './components/mainpage/mainpage.component';
import { AppComponent } from './app.component';
import { UsersComponent } from './components/users/users.component';
import { AddUserModalComponent } from './modals/add-user/add-user.component';
import { EditUserComponent } from './modals/edit-user/edit-user.component';
import { AssetsComponent } from './components/assets/assets.component';
import { AddAssetComponent } from './modals/add-asset/add-asset.component';
import { EditAssetComponent } from './modals/edit-asset/edit-asset.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainpageComponent},
  {path: 'users', component: UsersComponent},
  {path: 'addUser', component: AddUserModalComponent},
  {path: 'editUser', component: EditUserComponent},
  {path: 'assets', component: AssetsComponent},
  {path: 'addAsset', component: AddAssetComponent},
  {path: 'editAsset', component: EditAssetComponent},
  {path: '', redirectTo: 'AppComponent', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
