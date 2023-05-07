import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {User} from "./pojo/user.pojo";

@Injectable()
export class UserService {
  loginSubject = new BehaviorSubject<boolean>(false);
  //因為AppComponent只會instance一次，需用Subject動態追蹤
  loginStatus: boolean = false;
  //組件每次載入都會OnInit，可追蹤變數即可
  private backendData: { account: string, password: string } = {account: 'qaz123', password: '!Qq12345'}
  //從後端拿User物件
  private user: User = {
    account: 'qaz123',
    userName: '',
    email: '',
    birthday: new Date(),
    zipcode: '',
    addredd: '',
    image: '',
    lastLoginDate: new Date(),
    joinDate: new Date()
  };

  getData(): { account, password } {
    return {account: this.backendData.account, password: this.backendData.password}
  }

  login() {
    this.loginSubject.next(true);
    this.loginStatus = true
  }

  logout() {
    this.loginSubject.next(false);
    this.loginStatus = false;
  }


}
