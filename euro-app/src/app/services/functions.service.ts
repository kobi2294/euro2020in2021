import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Match } from '../models/match.model';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {
  readonly baseUrl: string = 'http://localhost:5000/euro2020at2021/us-central1';

  constructor(private http: HttpClient) { }

  saveMatches(matches: Match[]) {
    let url = `${this.baseUrl}/resetMatches`;
    let data = JSON.stringify(matches);
    return this.http.post(url, data).toPromise();    
  }
}
