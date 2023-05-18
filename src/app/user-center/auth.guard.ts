import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {UserHttpService} from "../user-http-service";
import {UserService} from "../user-service";
import {Inject, Injectable} from "@angular/core";

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.userService.loginStatus)
      return true
    else
    return this.router.createUrlTree(['/login']);
  }
}
