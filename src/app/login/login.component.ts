import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../user-service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup
  loginFail: boolean = false;

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    //登入狀態直接導到center組件
    if (this.userService.loginStatus) {
      this.router.navigate(['center'])
    }

    //形成form
    this.form = new FormGroup({
      'account': new FormControl(null,
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{2,20}$/)]),
      'password': new FormControl(null,
        [Validators.required, Validators.pattern(/^(?!\S*?(.)\1{3})(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,12}$/)])
    })
  }

  onSubmit() {
    const backendData = this.userService.getData()
    if (backendData.account === this.form.value.account && backendData.password === this.form.value.password) {
      this.userService.login()
      this.router.navigate(['center'])//之後routes加上userId
    } else {
      this.loginFail = true
    }
  }
}
