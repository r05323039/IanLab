import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, exhaustMap, map, tap, throwError} from "rxjs";//pipe important!!!
import {ResponseModel} from "./pojo/response.model";
import {UserModel} from "./pojo/user.model";
import {MessageModel} from "./pojo/message.model";

@Injectable({providedIn: 'root'})
export class UserHttpService {
  userSubject: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(null)
  messageSubject: BehaviorSubject<MessageModel> = new BehaviorSubject<MessageModel>(null)

  URL: string = '/backend/user'
  token: string

  constructor(private http: HttpClient,) {
  }

  //會員註冊
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

  //產生並獲取OTP
  requestOTP(account: string) {
    return this.http.get<ResponseModel>(this.URL + '/otp/gen/' + account)
      .pipe(
        exhaustMap(response => {
          if (response.message === '000') {
            return this.http.get<ResponseModel>(this.URL + '/otp/get/' + account)
          } else {
            return throwError('Failed to generate OTP');
          }
        })
      )
  }

  //忘記密碼
  forgetPw(account: string, otp: string, newPassword: string) {
    return this.http.post<ResponseModel>(this.URL + '/forgetpassword', null, {
      params: new HttpParams()
        .set('account', account)
        .set('otp', otp)
        .set('npwd', newPassword)
    })
  }

  //獲得USER物件後...
  private onGotUserModel(user: UserModel) {
    const userObj: UserModel = {...user}//創建新的user供引用，並且可以添加屬性
    this.userSubject.next(userObj)
  }

  //獲得Message物件後...
  private onGotMessageModel(msg: MessageModel) {
    const msgObj: MessageModel = {...msg}//創建新的user供引用，並且可以添加屬性
    this.messageSubject.next(msgObj)
  }

  //登入
  httpLogin(account: string, password: string) {
    return this.http.post<ResponseModel>(this.URL + '/login', null, {
      params: new HttpParams()
        .set('account', account)
        .set('password', password),
      observe: 'response' // 設置 observe 選項為 'response'，以獲取完整的 HTTP 響應
    })
      .pipe(
        tap(response => {
          if (response.body.message === '000') {
            //更新token
            this.token = response.headers.get('x-token')
            console.log('login-tap-token:\n' + this.token)
            //儲存User物件
            this.onGotUserModel(response.body.resEntity)
          }
        }),
        //將response由observe改回body
        map(response => response.body)
      )
  }

  //查詢會員 (更新user物件)
  find(account: string) {
    return this.http.get<ResponseModel>(this.URL + '/find/' + account)
      .subscribe(response => {
        if (response.message === "000") {
          this.onGotUserModel(response.resEntity)
        }
      })
  }

  //查詢會員訊息
  findMsg(account: string) {
    return this.http.get<ResponseModel>(this.URL + '/find/msg/' + account)
      .pipe(
        tap(response => {
          if (response.message === '000') {
            //儲存一份在這個service中
            this.onGotMessageModel(response.resEntity)
          }
          return response
        })
      )

  }

  //刪除會員訊息
  deleteMessage(ids: number[]) {
    return this.http.delete<ResponseModel>(this.URL + '/delete/msg', {
      params: {msgIds: ids}
    })
  }

  //重設密碼
  resetPassword(account: string, opwd: string, npwd: string) {
    return this.http.post<ResponseModel>(this.URL + '/resetpassword', null, {
      params: new HttpParams()
        .set('account', account)
        .set('opwd', opwd)
        .set('npwd', npwd)
    })
  }

  //更新會員資料
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
      .pipe(
        tap(response => {
          if (response.message === "000") {
            //處理返回的userEntity
            this.onGotUserModel(response.resEntity)
            return response
          } else {
            return throwError("something Wrong")
          }
        })
      )
  }


//取得會員上傳圖片
  getImage(account: string, image: string) {
    const url = this.URL + '/image/' + account + '/' + image
    return this.http.get(url, {responseType: 'blob'})
  }

//驗證OTP
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

  genMse(account: string) {
    return this.http.post<ResponseModel>(this.URL + '/msg/add', null, {
      params: new HttpParams()
        .set('account', account)
    })
  }
}

