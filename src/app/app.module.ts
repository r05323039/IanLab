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
import {UserHttpService} from "./user-http-service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ApiTestComponent} from './api-test/api-test.component';
import {AuthInterceptorService} from "./auth-interceptor.service";
import { VerifyOtpComponent } from './forget-password/verify-otp/verify-otp.component';
import { ResetPasswordComponent } from './forget-password/reset-password/reset-password.component';
import { GetAccountComponent } from './forget-password/get-account/get-account.component';
import { UpdateComponent } from './user-center/update/update.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { MessageDialogComponent } from './user-center/user-message/message-dialog/message-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";

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
    ApiTestComponent,
    VerifyOtpComponent,
    ResetPasswordComponent,
    GetAccountComponent,
    UpdateComponent,
    MessageDialogComponent


  ],
  imports: [BrowserModule, UserRoutes, ReactiveFormsModule, FormsModule, HttpClientModule, MatCheckboxModule,
    MatButtonModule, MatDialogModule,],
  providers: [UserService, UserHttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent],
})
export class AppModule {
}
