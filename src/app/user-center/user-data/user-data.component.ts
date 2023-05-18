import {Component, OnInit} from '@angular/core';
import {UserService} from "../../user-service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserHttpService} from "../../user-http-service";
import {UserModel} from "../../pojo/user.model";

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css'],
})
export class UserDataComponent implements OnInit {

  user: UserModel
  preview
  constructor(private userService: UserService,
              private userHttpService: UserHttpService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }
  ngOnInit(): void {
    if (this.userService.user !== null) {
      //載入user資料
      this.user = this.userService.user;
      //讀圖片
      if (this.user.image !== null) {
        this.userHttpService.getImage(this.user.account, this.user.image)
          .subscribe(response => {
            const reader = new FileReader()
            reader.readAsDataURL(response)
            reader.onload = () => {
              this.preview = reader.result
            }
          })
      }
    }
  }

  onUpdate(){
    this.router.navigate(['center', 'update']);
  }
}
