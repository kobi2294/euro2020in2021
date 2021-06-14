import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatchRecord } from 'src/app/models/match-record';
import { Match } from 'src/app/models/match.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-guesses',
  templateUrl: './guesses.component.html',
  styleUrls: ['./guesses.component.scss']
})
export class GuessesComponent implements OnInit {
  records$!: Observable<MatchRecord[]>;

  constructor(
    private data: DataService
  ) { }

  ngOnInit(): void {
    let now = Date.now().valueOf();
    this.records$ = this.data.myMatchRecords$.pipe(
      map(records => records.filter(record => record.date.valueOf() > now))
    );
  }

}
