import {RouterModule, Routes} from '@angular/router';
import {UserCenterComponent} from './user-center/user-center.component';
import {UserDataComponent} from './user-center/user-data/user-data.component';
import {UserMessageComponent} from './user-center/user-message/user-message.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {NgModule} from '@angular/core';
import {VerifyOtpComponent} from "./forget-password/verify-otp/verify-otp.component";
import {ResetPasswordComponent} from "./forget-password/reset-password/reset-password.component";
import {GetAccountComponent} from "./forget-password/get-account/get-account.component";
import {UpdateComponent} from "./user-center/update/update.component";
import {AuthGuard} from "./user-center/auth.guard";


const userRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'forgetPassword', component: ForgetPasswordComponent
    , children: [
      {path: '', component: GetAccountComponent},
      {path: 'verify', component: VerifyOtpComponent},
      {path: 'resetPassword', component: ResetPasswordComponent}
    ]
  },
  {
    path: 'center',
    component: UserCenterComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'data', component: UserDataComponent},
      {path: 'message', component: UserMessageComponent},
      {path: 'update', component: UpdateComponent}
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
