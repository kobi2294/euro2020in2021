import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Match } from '../models/match.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {
  constructor(private http: HttpClient) { }

  saveMatches(matches: Match[]) {
    let url = `${environment.httpBase}/api/matches`;
    let data = JSON.stringify(matches);
    return this.http.post(url, data).toPromise();    
  }

  getMatches() {
    let url = `${environment.httpBase}/api/matches`;
    return this.http.get<Match[]>(url).toPromise();    
  }

  updateUser(user: User) {
    let url = `${environment.httpBase}/api/users`;
    let data = JSON.stringify(user);
    return this.http.post(url, data).toPromise();    
  }

  helloWorld() {
    let url = `${environment.httpBase}/app/hello`;
    return this.http.get<string>(url).toPromise();    
  }
}
