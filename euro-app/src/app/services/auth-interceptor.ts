import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";
import { first, switchMap } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private fireAuth: AngularFireAuth){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.fireAuth.idToken.pipe(
            first(), 
            switchMap(token => {
                if (token) req = req.clone({ setHeaders: { Authorization: `Bearer ${token}`}});
                return next.handle(req);
            })
        )
    }
}