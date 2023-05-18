import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../user-service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {showErrorMsg, UserValidators} from "../UserValidators";
import {UserHttpService} from "../user-http-service";

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


  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private userHttpService: UserHttpService) {
  }

  ngOnInit(): void {
    //登入狀態直接導到center組件
    if (this.userService.loginStatus) {
      this.router.navigate(['center'])
    }
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
    this.userHttpService.login(this.form.value.account, this.form.value.password)
      .subscribe(response => {
          if (response.body.message === "000") {
            //token
            const token = response.headers.get('x-token')
            console.log('login-token:\n' + token)
            this.userHttpService.token = token;
            //user
            this.userService.user = response.body.resEntity
            // console.log(this.userService.user)
            //更改狀態
            this.userService.login()
            //導頁
            this.router.navigate(['center'])
          } else {
            this.loginFailMsg = '帳號或密碼錯誤'
          }
        }
      )
  }
}
