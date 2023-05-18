import {Component, OnInit} from '@angular/core';
import {UserService} from "../../user-service";
import {UserHttpService} from "../../user-http-service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  account: string
  npwd: string
  npwd2: string
  pwErrMsg: boolean

  constructor(private userService: UserService,
              private userHttpService: UserHttpService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.account = this.activatedRoute.snapshot.queryParams['account']
  }

  verifyPw() {
    const pattern = /^(?!\S*?(.)\1{3})(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,12}$/
    if (!pattern.test(this.npwd))
      this.pwErrMsg = true
    else
      this.pwErrMsg = false
  }

  //設定新密碼
  setNpwd() {
    this.userHttpService.forgetPw(this.account, this.activatedRoute.snapshot.queryParams['otp'], this.npwd)
      .subscribe(response => {
    this.router.navigate(['login'])
    })
  }
}
