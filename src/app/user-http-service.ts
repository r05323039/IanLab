import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {map, Subject} from "rxjs";//pipe important!!!
import {ResponseModel} from "./pojo/response.model";
import {UserModel} from "./pojo/user.model";
import {UserService} from "./user-service";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class UserHttpService {

  URL: string = '/backend/user'
  otpSubject: Subject<string> = new Subject<string>()
  token: string

  constructor(private http: HttpClient,
              private userService: UserService,
              private router: Router) {
  }

  //1.會員註冊
  register(account: string,
           password: string,
           username: string,
           email: string,
           birthday: string,//yyyy/MM/dd
           zipCode?: string,
           address?: string,
           image?: File) {

    const formData: FormData = new FormData();
    formData.append('account', account);
    formData.append('password', password);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('birthday', birthday);
    formData.append('zipCode', zipCode);
    formData.append('address', address);

    if (image) {
      formData.append('image', image);
    }
    return this.http.post<ResponseModel>(this.URL + '/register', formData)
  }

  //2.產生OTP
  genOTP(account: string) {
    return this.http.get<ResponseModel>(this.URL + '/otp/gen/' + account)
  }

  //3.查詢OTP
  getOTP(account: string) {
    return this.http.get<ResponseModel>(this.URL + '/otp/get/' + account)
  }

  //4.忘記密碼
  forgetPw(account: string, otp: string, newPassword: string) {
    return this.http.post<ResponseModel>(this.URL + '/forgetpassword', null, {
      params: new HttpParams()
        .set('account', account)
        .set('otp', otp)
        .set('npwd', newPassword)
    })
  }

  //5.登入
  login(account: string, password: string) {
    return this.http.post<ResponseModel>(this.URL + '/login', null, {
      params: new HttpParams()
        .set('account', account)
        .set('password', password),
      observe: 'response' // 設置 observe 選項為 'response'，以獲取完整的 HTTP 響應
    })
  }

  //6.查詢會員
  find(account: string) {
    return this.http.get<ResponseModel>(this.URL + '/find/' + account)
      .subscribe(response => {
        if (response.message === "000") {
          //user
          this.userService.user = response.resEntity
          this.router.navigate(['center/data'])
        }
      })
  }

  //7.查詢會員訊息
  findMsg(account: string) {
    return this.http.get<ResponseModel>(this.URL + '/find/msg/' + account)
  }

  //8.刪除會員訊息
  deleteMessage(ids: number[]) {
    return this.http.delete<ResponseModel>(this.URL + '/delete/msg', {
      params: {msgIds: ids}
    })
  }

  //9.重設密碼
  resetPassword(account: string, opwd: string, npwd: string) {
    return this.http.post<ResponseModel>(this.URL + '/resetpassword', null, {
      params: new HttpParams()
        .set('account', account)
        .set('opwd', opwd)
        .set('npwd', npwd)
    })
  }

  //10.更新會員資料
  update(user: UserModel) {
    const formData: FormData = new FormData();
    formData.append('account', user.account);

    if (user.userName)
      formData.append('username', user.userName);
    if (user.birthday)
      formData.append('birthday', user.birthday);
    if (user.zipcode)
      formData.append('zipCode', user.zipcode);
    if (user.address)
      formData.append('address', user.address);
    if (user.image) {
      formData.append('image', user.image);
    }
    return this.http.post<ResponseModel>(this.URL + '/update', formData)
  }


//11.取得會員上傳圖片
  getImage(account: string, image: string) {
    const url = this.URL + '/image/' + account + '/' + image
    return this.http.get(url, {responseType: 'blob'})
  }

//12.驗證OTP
  verifyOTP(account: string, otp: string) {
    return this.http.post<ResponseModel>(this.URL + '/otp/verify', null, {
      params: new HttpParams()
        .set('account', account)
        .set('otp', otp)
    })
  }


  existAccount(account: string) {
    return this.http.get<ResponseModel>(this.URL + '/' + account)
  }
}

