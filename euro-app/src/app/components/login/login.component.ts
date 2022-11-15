import { Component, OnInit } from '@angular/core';
import { combineChange } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isBusy$!: Observable<boolean>;
  busyMessage$!: Observable<string>;
  err$!: Observable<string>;
  idle$!: Observable<boolean>;


  constructor(
    private authService: AuthService, 
  ) { }

  ngOnInit(): void {
    this.busyMessage$ = this.authService.progressMessage$;
    this.isBusy$ = this.busyMessage$.pipe(map(msg => msg !== ''));
    this.err$ = this.authService.errorState$;
    this.idle$ = combineLatest([this.isBusy$, this.err$]).pipe(
      map(([isBusy, err]) => !isBusy && !err)
    );
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
