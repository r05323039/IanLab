import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../user-service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  @ViewChild('ref_form') form;

  page: number = 1; //導頁控制
  //帳號
  formAccount: FormGroup
  accountErrMsg: boolean //錯誤訊息開關
  //OTP
  opt: string;//保留取得的OTP
  counterSubscription: Subscription = new Subscription()//訂閱變數，用於取消訂閱
  sendableOTP: boolean
  second: number = 6;
  otpErrMsg: boolean
  //npwd
  npwd: string
  npwd2: string
  pwErrMsg: boolean

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    // 初始化表單
    this.formAccount = new FormGroup({
      'account': new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{2,20}$/)])
    })
  }

  getOpt(): void {//產生OTP  (改後端取得，如果產生失敗...)
    let result = '';
    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
      result += c.charAt(Math.floor(Math.random() * c.length));
    }
    //保存到成員變數
    this.opt = result
    console.log("opt:" + this.opt)
  }

  //表單formAccount提交後
  onSubmitFormAccount() {
    //核對帳號存在 (改後端)
    const backendData = this.userService.getData()
    if (this.formAccount.value.account === backendData.account) {
      //取得OPT並保存到成員變數
      this.getOpt()
      //啟動重發倒數，並跳轉form
      this.optResendCounter()
      this.page = 2;
      this.accountErrMsg = false
    } else {
      //顯示帳號錯誤訊息
      this.accountErrMsg = true
    }
  }

  //OPT計時器
  optResendCounter() {
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

  ngOnDestroy(): void {
    this.counterSubscription.unsubscribe()
  }

  //驗證OPT
  verifyOpt(ref_opt) {
    if (this.opt === ref_opt.control.value) {
      this.otpErrMsg = false;
      this.page = 3;
    } else
      this.otpErrMsg = true;
  }

  //密碼規範
  verifyPw() {
    const pattern = /^(?!\S*?(.)\1{3})(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,12}$/
    if (!pattern.test(this.npwd))
      this.pwErrMsg = true
    else
      this.pwErrMsg = false
  }

  //設定新密碼
  setNpwd() {
     //發送到後端API
     this.router.navigate(['login'])

  }
}
