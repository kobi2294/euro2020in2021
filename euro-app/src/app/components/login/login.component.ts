import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isBusy$!: Observable<boolean>;
  busyMessage$!: Observable<string>;
  err$!: Observable<string>;
  userNull$!: Observable<boolean>;


  constructor(
    private authService: AuthService, 
  ) { }

  ngOnInit(): void {
    this.busyMessage$ = this.authService.progressMessage$;
    this.err$ = this.authService.errorState$;
    this.userNull$ = combineLatest([this.authService.currentFirebaseUser$, this.err$, this.authService.isBusy$]).pipe(
      map(([user, err, busy]) => (user === null) && !err && !busy), 
      startWith(false)
    );
    this.isBusy$ = combineLatest([this.userNull$, this.authService.isBusy$, this.err$]).pipe(
      map(([userNull, isBusy, err]) => (!userNull || isBusy) && (err === ''))
    )

  }

  async authenticateFacebook() {
    await this.auth(() => this.authService.facebookAuth())
  }

  async authenticateGoogle() {
    await this.auth(() => this.authService.googleAuth())
  }

  async authenticateTwitter() {
    await this.auth(() => this.authService.twitterAuth())
  }

  async auth(action:  () => Promise<any>) {
    await action();
  }

}
