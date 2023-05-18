import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../user-service";
import {UserHttpService} from "../../user-http-service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html'
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  counterSubscription: Subscription = new Subscription()
  sendableOTP: boolean
  second: number = 6;
  otpErrMsg: boolean
  account: string

  constructor(private userService: UserService,
              private userHttpService: UserHttpService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.otpResendCounter()
    this.account = this.activatedRoute.snapshot.queryParams['account']
  }

  requestOTP() {
    this.userHttpService.genOTP(this.account)//pipe串
      .subscribe(response => {
        this.userHttpService.getOTP(this.account)
          .subscribe(response => {
            console.log(response.resEntity)
          })
    })
  }

  otpResendCounter() {
    this.sendableOTP = false;
    const counter = new Observable<number>(observer => {
      let count: number = 6;
      setInterval(() => {
        observer.next(count)
        if (count === 0) {
          observer.complete()
        }
        count--
      }, 500)
    })

    this.counterSubscription = counter.subscribe(
      count => {
        this.second = count //把觀察的count放入成員變數
      }, error => {
      }, () => {
        this.second = 6;//second初始化，否得第二次讀秒會從0開始
        this.sendableOTP = true;
      })
  }

  verifyOtp(ref_otp) {
    this.userHttpService.verifyOTP(this.account, ref_otp.control.value)
      .subscribe(response => {
        if (response.httpStatusCode === '200' && response.message === '000') {
          this.otpErrMsg = false;
          this.router.navigate(['forgetPassword', 'resetPassword'], {queryParams: {'account': this.account,
            'otp':ref_otp.control.value}})
        } else
          this.otpErrMsg = true;
      })
  }

  ngOnDestroy(): void {
    this.counterSubscription.unsubscribe()
  }
}
