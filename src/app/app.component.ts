import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserHttpService} from "./user-http-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  loginMode:boolean = false

  constructor(private userHttpService:UserHttpService,
              private router: Router) {
  }

  ngOnInit(): void {
      this.userHttpService.userSubject.subscribe(user=>{
       this.loginMode = !!user
      })
  }

  logout() {
    this.userHttpService.userSubject.next(null);
    this.router.navigate(['login'])
  }
}
