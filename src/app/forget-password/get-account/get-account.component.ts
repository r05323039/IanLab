import {Component, OnInit} from '@angular/core';
import {showErrorMsg, UserValidators} from "../../UserValidators";
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../user-service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserHttpService} from "../../user-http-service";
import {relative} from "@angular/compiler-cli";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-get-account',
  templateUrl: './get-account.component.html'
})
export class GetAccountComponent implements OnInit {
  form: FormGroup
  accountErrMsg: boolean

  constructor(private userService: UserService,
              private userHttpService: UserHttpService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    // 初始化表單
    this.form = new FormGroup({
      'account': new FormControl(null, [UserValidators.account])
    })
  }

  onSubmitFormAccount() {
    const account = this.form.value.account
    //驗證帳號存在
    this.userHttpService.existAccount(account)
      .subscribe(response => {
        if (response.httpStatusCode === '200' && response.message === '000') {
          //發送OTP請求
          this.userHttpService.genOTP(account).subscribe(response => {
            this.userHttpService.getOTP(account)
              .subscribe(response => {
                  console.log(response.resEntity)//打印otp 可改為email發送
                  this.router.navigate(['verify'],
                    {
                      relativeTo: this.activatedRoute,
                      queryParams: {'account': account}
                    })
                }
              )
          })
        } else {
          this.accountErrMsg = true
        }
      })
    this.accountErrMsg = false
  }

  protected readonly showErrorMsg = showErrorMsg;
}
