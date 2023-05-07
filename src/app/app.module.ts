import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {UserCenterComponent} from './user-center/user-center.component';
import {UserDataComponent} from './user-center/user-data/user-data.component';
import {UserMessageComponent} from './user-center/user-message/user-message.component';
import {LoginComponent} from './login/login.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {RegisterComponent} from './register/register.component';
import {UserRoutes} from './user-routes';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserService} from "./user-service";

@NgModule({
  declarations: [
    AppComponent,
    UserCenterComponent,
    UserDataComponent,
    UserMessageComponent,
    //
    LoginComponent,
    ForgetPasswordComponent,
    RegisterComponent,
  ],
  imports: [BrowserModule, UserRoutes, ReactiveFormsModule,FormsModule],
  providers: [UserService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
