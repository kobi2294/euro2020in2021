import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Match } from './models/match.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  matches$!: Observable<Match[]>;

  constructor(private store: AngularFirestore) { }

  ngOnInit(): void {
    let matches$ = this.store.collection('matches').valueChanges() as Observable<Match[]>;
    this.matches$ = matches$.pipe(
      map(all => [...all].sort((m1, m2) => m1.id - m2.id))
    );
  }

}
