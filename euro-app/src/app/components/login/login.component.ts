import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isBusy: boolean = false;
  busyMessage: string = '';
  err: string = '';


  constructor(
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private dataService: DataService
  ) { }

  ngOnInit(): void {
  }

  async authenticateFacebook() {
    this.busyMessage = 'Authentication with Facebook';
    await this.auth(() => this.authService.facebookAuth())
  }

  async authenticateGoogle() {
    this.busyMessage = 'Authentication with Google';
    await this.auth(() => this.authService.googleAuth())
  }

  async authenticateTwitter() {
    this.busyMessage = 'Authentication with Twitter';
    await this.auth(() => this.authService.twitterAuth())
  }

  async auth(action:  () => Promise<any>) {
    this.isBusy = true;
    try {
      await action();
    } catch (err) {
      this.err = String(err);
    } 
  }

}
