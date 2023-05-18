import {Component, OnInit} from '@angular/core';
import {UserService} from "./user-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  status: boolean

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.userService.loginSubject.subscribe((status) => {
      this.status = status
      //動態更新只會在subscribe內
    })
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['login'])
  }
}
