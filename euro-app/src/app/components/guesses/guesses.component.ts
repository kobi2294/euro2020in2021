import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, interval, Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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

    this.records$ = combineLatest([timer(0, 60000), this.data.myMatchRecords$]).pipe(
      tap(val => console.log('future guesses calc', val)), 
      map(([_, records]) => records
                    .filter(record => record.date.valueOf() > now)
                    .filter(record => record.match.home && record.match.away))
    );
    
  }

  trackByMatchId(index: number, record: MatchRecord) {
    return record.match.id;
  }

}
