import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {ResponseModel} from "./pojo/response.model";
import {Injectable} from "@angular/core";
import {UserHttpService} from "./user-http-service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

//配置 模擬URL 4200 ->8084 proxy.conf.js
  constructor(private userHttpService:UserHttpService) {

  }

  intercept(req: HttpRequest<ResponseModel>, next: HttpHandler): Observable<HttpEvent<any>> {

    const addTokenUrls: string[] =
      ['/find', '/find/msg', '/delete', '/resetpassword', '/update', '/image']

    if (addTokenUrls.some(theUrl => req.url.includes(theUrl))){
      // console.log('intercept work')
      const modifiedReq = req.clone(
        {setHeaders:{'x-token':this.userHttpService.token}}
      )
      return next.handle(modifiedReq)
    }

    return next.handle(req)
  }
}
