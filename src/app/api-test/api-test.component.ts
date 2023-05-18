import {Component, OnInit} from '@angular/core';
import {UserHttpService} from "../user-http-service";
import {UserModel} from "../pojo/user.model";

@Component({
  selector: 'app-api-test',
  templateUrl: './api-test.component.html'
})
export class ApiTestComponent implements OnInit {

  account: string = 'yi455184'
  password: string = '!Qq12345'
  account2: string = 'ianlin1234'
  otp: string
  user: UserModel
  imageUrl
  constructor(private userHttpService: UserHttpService) {
  }

  ngOnInit(): void {
    this.userHttpService.otpSubject.subscribe(data => {
        this.otp = data
        console.log('OTP in Test:\n' + this.otp)
      }
    )
  }

  register() {
    // this.userHttpService.register()
  }

  genOTP() {
    this.userHttpService.genOTP(this.account)
  }

  getOTP() {
    this.userHttpService.getOTP(this.account)
  }

  forgetPw() {
    this.userHttpService.forgetPw(this.account, this.otp, this.password)
  }

  onLogin() {
    this.userHttpService.login(this.account, this.password)
      .subscribe(response => {
        console.log(response.body)
        this.user = response.body.resEntity
      })
  }

  findUser() {
    this.userHttpService.find(this.account)
  }

  onGetImage() {
    if (this.user!== undefined) {
      this.userHttpService.getImage(this.account, this.user.image)
        .subscribe(response => {
          this.imageUrl = URL.createObjectURL(response);
          console.log(response)
          // const blobUrl = URL.createObjectURL(response);
          // console.log(blobUrl);
        })
    }else {
      console.log('no image')
    }
  }

  verifyOTP() {
    this.userHttpService.verifyOTP(this.account, this.otp)
  }
}
