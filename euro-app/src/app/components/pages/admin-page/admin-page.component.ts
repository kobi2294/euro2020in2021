import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Observable } from 'rxjs';
import { debounceTime, first, map, tap } from 'rxjs/operators';
import { COUNTRIES } from 'src/app/models/country-enum.model';
import { Match } from 'src/app/models/match.model';
import { STAGES } from 'src/app/models/stage-enum.model';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { toLocalIsoString } from 'src/app/tools/dates';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'], 
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ]
})
export class AdminPageComponent implements OnInit {
  matches$!: Observable<Match[]>;
  readonly columns = ['id', 'stage', 'date', 'home', 'away', 'score'];
  readonly stages = STAGES;
  readonly countries = COUNTRIES;


  form$!: Observable<FormArray>;

  constructor(
    private db: AngularFirestore, 
    private data: DataService,
    private funcs: ApiService) { }

  ngOnInit(): void {
    this.matches$ = this.data.allMatches$;
    
    this.form$ = this.matches$.pipe(
      map(matches => this.buildForm(matches))
    );
  }

  buildForm(matches: Match[]): FormArray {
    return new FormArray(matches.map(match => new FormGroup({
        id: new FormControl(match.id), 
        stage: new FormControl(match.stage), 
        date: new FormControl(this.fixDateForForm(match.date)), 
        home: new FormControl(match.home), 
        away: new FormControl(match.away), 
        homeScore: new FormControl(match.homeScore), 
        awayScore: new FormControl(match.awayScore)
      })
    ))
  }

  getGroups(formArray: FormArray) {
    return formArray.controls as FormGroup[]
  }

  private fixDateForForm(dateStr: string): string {
    let date = new Date(dateStr);
    //date.setFullYear(2022);
    const res = toLocalIsoString(date).slice(0, 16);
    return res;
  }

  async save(form: FormArray) {
    const val = form.controls
        .filter(group => group.dirty)
        .map(group => group.value as Match)
        .map(match => ({
          ...match, 
          date: new Date(match.date).toUTCString()
        }));

      await this.funcs.saveMatches(val);
      await this.funcs.triggerPublishResults();
  }

  async triggerPublishResults() {
    await this.funcs.triggerPublishResults();
  }

}
