import {Component, OnInit,} from '@angular/core';
import {UserService} from "../user-service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {showErrorMsg, UserValidators} from "../UserValidators";
import addressData from "../../assets/CityCountyData.json"
import {UserHttpService} from "../user-http-service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  protected readonly showErrorMsg = showErrorMsg;
  protected readonly addressData = addressData;
  form: FormGroup
  //email
  errMsg: string
  emailBtn: string = '認證'
  opt: string = null;
  optInput: string
  emailLock: boolean = false;
  //address
  cityIndex: number;
  areaIndex: number;
  zipCode;
  //image
  preview = null
  //
  responseErr: string = null

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private userHttpService: UserHttpService
  ) {
  }

  ngOnInit(): void {
    //形成form
    this.form = new FormGroup({
      'account': new FormControl(null, [UserValidators.account]),
      'username': new FormControl(null, [UserValidators.username]),
      'email': new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(50)]),
      'password': new FormControl(null, [UserValidators.password]),
      'password2': new FormControl(null, [this.confirmPassword]),
      'birthday': new FormControl(null, [Validators.required, UserValidators.birthday]),
      'address': new FormGroup({
        'city': new FormControl(null),
        'area': new FormControl(null),
        'detail': new FormControl(null)//住址如果必填，required這個就好
      }),
      'image': new FormControl()
    })
    // console.log(addressData)
  }

  //email
  checkEmail() {
    if (this.form.get('email').valid) {
      this.getOpt()
      this.emailBtn = '重發認證'
      this.errMsg = null
    } else {
      this.errMsg = '請輸入email'
    }
  }

  getOpt(): void {//(API取得OTP)
    let result = '';
    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
      result += c.charAt(Math.floor(Math.random() * c.length));
    }
    //保存到成員變數
    this.opt = result
    console.log("opt:" + this.opt)
  }

  verifyOtp() {
    if (this.optInput.length === 6) {
      if (this.opt === this.optInput) {
        this.opt = null
        this.emailBtn = null;
        this.errMsg = null;
        this.emailLock = true
      } else {
        this.errMsg = '檢核碼錯誤'
      }
    }
  }

  //password
  confirmPassword(control: FormControl) {
    if (control.value === null)
      return {'required': true};

    const password1 = control.parent?.get('password')?.value//'password'硬編碼不會解  (control:FormControl, name: FormControlName)
    if (control.value !== password1)
      return {"confirmPassword": true}
    return null;
  }

  //address
  onCityChange() {
    this.cityIndex = this.form.get('address.city').value
    // console.log(addressData[this.cityIndex].CityName)
  }

  onAreaChange() {
    this.areaIndex = this.form.get('address.area').value
    this.zipCode = addressData[this.cityIndex].AreaList[this.areaIndex].ZipCode
    // console.log(addressData[this.cityIndex].AreaList[this.areaIndex].AreaName)
  }

  //image
  onFileChange($event) {
    const fileInput = event.target as HTMLInputElement;//斷言取得屬性方法
    const file = fileInput.files?.[0];//files為fileList可能null，?為安全符，[0]為第一個檔案

    const reader = new FileReader();
    reader.readAsDataURL(file)//把檔案寫成base64 (base64丟預覽圖顯示 / 傳輸仍用file)
    reader.onload = () => {//一旦完成，執行{}
      const imageControl = this.form.get('image');
      if (imageControl) {
        this.preview = reader.result
        imageControl.setValue(file)
      }
    }
  }

  onSubmit() {
    const value = this.form.value
    console.log(value)
    //birthday
    const formattedDate = value.birthday.split('-').join('/')
    //address
    let address: string;
    if (value.address !== null) {
      address = addressData[this.cityIndex].CityName + addressData[this.cityIndex].AreaList[this.areaIndex].AreaName
        + value.address.detail;
    }
    //call API
    this.userHttpService.register(
      value.account,
      value.password,
      value.username,
      value.email,
      formattedDate,
      this.zipCode ? this.zipCode : '',
      address ? address : '',
      value.image)

      .subscribe(response => {
        // console.log(response)
        if (response.httpStatusCode === '200' && response.message === '000') {
          this.router.navigate(['/login'], {queryParams: {success: true}});
        } else {
          this.doError(response.message)
        }
      })
  }

  doError(errorCode: string) {
    switch (errorCode) {
      case '901'://失敗 拆開寫method
        this.responseErr = '帳號已存在';
        break;
      case '902':
        this.responseErr = '信箱已存在'
        break
      default:
        this.responseErr = '註冊失敗，請確認資料正確'
        break;
    }
  }
}
