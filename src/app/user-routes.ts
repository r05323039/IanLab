import {RouterModule, Routes} from '@angular/router';
import {UserCenterComponent} from './user-center/user-center.component';
import {UserDataComponent} from './user-center/user-data/user-data.component';
import {UserMessageComponent} from './user-center/user-message/user-message.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {NgModule} from '@angular/core';


const userRoutes: Routes = [
  {path: 'login', component: LoginComponent, data: {'action': 1}},
  {path: 'register', component: RegisterComponent, data: {'action': 2}},
  {path: 'forgetPassword', component: ForgetPasswordComponent, data: {'action': 3}},

  {
    path: 'center',
    component: UserCenterComponent,
    children: [
      {path: '', component: UserDataComponent},
      {path: 'data', component: UserDataComponent},
      {path: 'message', component: UserMessageComponent},
    ],
  },

  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(userRoutes)],
  exports: [RouterModule],
})
export class UserRoutes {
}
