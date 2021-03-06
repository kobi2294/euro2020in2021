import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Match } from './models/match.model';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import firebase from 'firebase/app';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { User } from './models/user.model';
import { RouteRulesService } from './services/route-rules.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], 
  animations: [
    slideInAnimation
  ]
})
export class AppComponent implements OnInit {
  user$!: Observable<User | null>;
  hasRequired$!: Observable<boolean>;

  constructor(
    private authService: AuthService, 
    private routeRulesService: RouteRulesService) { }

  ngOnInit(): void {
    this.user$ = this.authService.currentUser$;
    this.hasRequired$ = this.routeRulesService.required$.pipe(
      map(required => required !== null)
    );
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet 
      && outlet.activatedRouteData
      && outlet.activatedRouteData['animationOrder']
  }

  async logout() {
    await this.authService.logout();
  }

  // async addGuess(gameNumber: number, result: string) {
  //   let user = (await this.user$).user?.email;
  //   let obj = {
  //     "game": gameNumber, 
  //     "result": result, 
  //     "user": user, 
  //     "timestamp": firebase.firestore.FieldValue.serverTimestamp()
  //   }

  //   await this.store.collection('guesses').add(obj);
  // }

}
