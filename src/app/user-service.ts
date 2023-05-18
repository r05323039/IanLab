import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {UserModel} from "./pojo/user.model";

@Injectable({providedIn: "root"})
export class UserService {
  //因為AppComponent只會instance一次，需用Subject動態追蹤
  loginSubject = new BehaviorSubject<boolean>(false);
  //組件每次載入都會OnInit，可追蹤變數即可
  loginStatus: boolean = false;
  //TOKEN接收發送
  tokenSubject: Subject<string> = new Subject();
  //定義接收user物件
  user:UserModel;


  login() {
    this.loginSubject.next(true);
    this.loginStatus = true
  }

  logout() {
    this.loginSubject.next(false);
    this.loginStatus = false;
  }
}
