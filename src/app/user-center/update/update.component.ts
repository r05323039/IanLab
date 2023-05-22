import {Component, OnInit} from '@angular/core';
import {UserHttpService} from "../../user-http-service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserModel, UserModelBuilder} from "../../pojo/user.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {showErrorMsg, UserValidators} from "../../UserValidators";
import addressData from "../../../assets/CityCountyData.json";


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  user: UserModel
  form: FormGroup
  //address
  cityIndex: number;
  areaIndex: number;
  zipCode;
  //image
  preview = null

  constructor(private userHttpService: UserHttpService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    //載入user資料
    this.userHttpService.userSubject.subscribe(user => {
      this.user = user
    })
    this.form = new FormGroup({
      'account': new FormControl(this.user.account),
      'username': new FormControl(null, [Validators.pattern(/^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/)]),
      'birthday': new FormControl(null, [UserValidators.birthday]),
      'address': new FormGroup({
        'city': new FormControl(null),
        'area': new FormControl(null),
        'detail': new FormControl(null)//住址如果必填，required這個就好
      }),
      'image': new FormControl()
    })
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
    const fileInput = event.target as HTMLInputElement;//告訴編譯器物件，取得files屬性
    const file = fileInput.files?.[0];//[0]代表第一個檔案

    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = () => {
      const imageControl = this.form.get('image');
      if (imageControl) {
        this.preview = reader.result//寫成base64才能做預覽圖
        imageControl.setValue(file)//pass value用原始的file
      }
    }
  }

  onSubmit() {
    const value = this.form.value
    //這兩個在後端為非空，如果沒有新的input就沿用舊的value
    const username = value.username !== null ? value.username : this.user.userName
    const birthday = value.birthday !== null ? value.birthday.split('-').join('/') : this.user.birthday
    //address
    let address: string;
    if (value.address.detail !== null) {
      address = addressData[this.cityIndex].CityName + addressData[this.cityIndex].AreaList[this.areaIndex].AreaName
        + value.address.detail;
    }
    //封裝data
    const user = new UserModelBuilder()
      .setAccount(this.user.account)
      .setUserName(username)
      .setBirthday(birthday)
      .setAddress(address)
      .setImage(value.image)//圖片可為null，直接丟即可
      .build()
    //call API update
    this.userHttpService.update(user).subscribe(
      response => {
        if (response.message = '000') {
          this.router.navigate(['center/data'])
        } else {
        }
      }
    )
  }

  protected readonly showErrorMsg = showErrorMsg;
  protected readonly addressData = addressData;
}
