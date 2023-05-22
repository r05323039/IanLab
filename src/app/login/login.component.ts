import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {ActivatedRoute, Router} from "@angular/router";
import {showErrorMsg, UserValidators} from "../UserValidators";
import {UserHttpService} from "../user-http-service";
import {map, take, tap} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  protected readonly showErrorMsg = showErrorMsg;
  form: FormGroup
  loginFailMsg: string;
  registerMsg: boolean;


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private userHttpService: UserHttpService) {
  }

  ngOnInit(): void {
    //登入狀態直接導到center組件
    this.userHttpService.userSubject.pipe(
      take(1),
      map(user => (user !== null)),
      tap(loginMode => {
        if (loginMode)
          this.router.navigate(['center'])
      })
    ).subscribe()
    //是否由註冊成功跳轉
    this.activatedRoute.queryParams.subscribe(params => {
      const success = params['success'];
      if (success === 'true') {
        this.registerMsg = true;
      }
    })

    //形成form
    this.form = new FormGroup({
      'account': new FormControl(null,
        [Validators.required, UserValidators.account]),
      'password': new FormControl(null,
        [Validators.required, UserValidators.password])
    })
  }


  onSubmit() {
    this.userHttpService.httpLogin(this.form.value.account, this.form.value.password)
      .subscribe(response => {
          if (response.message === "000") {
            //導頁
            this.router.navigate(['center'])
          } else {
            this.loginFailMsg = '帳號或密碼錯誤'
          }
        }
      )
  }
}
