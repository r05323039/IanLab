import {Component, OnInit} from '@angular/core';
import {UserService} from "../user-service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-user-center',
  templateUrl: './user-center.component.html',
  styleUrls: ['./user-center.component.css'],
})
export class UserCenterComponent implements OnInit {
  status: boolean


  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    if (!this.userService.loginStatus) {
      this.router.navigate(['login'])
    }
  }
}
