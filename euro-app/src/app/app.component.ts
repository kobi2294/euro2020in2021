import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Match } from './models/match.model';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user$!: Observable<firebase.User | null>;

  constructor(
    private authService: AuthService) { }

  ngOnInit(): void {
    this.user$ = this.authService.currentUser$;
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
