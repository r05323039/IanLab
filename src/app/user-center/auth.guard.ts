import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import { map, Observable, take} from "rxjs";
import {UserHttpService} from "../user-http-service";
import { Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private userHttpService: UserHttpService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userHttpService.userSubject.pipe(
      take(1),//抽取一個值後unsubscribe，不要持續訂閱
      map(user => {
        if (user != null)
          return true
        else
          return this.router.createUrlTree(['/login']);
      })
    )

  }
}
