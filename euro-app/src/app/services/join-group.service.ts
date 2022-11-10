import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class JoinGroupService implements Resolve<void> {

  constructor(
    private router: Router, 
    private auth: AuthService, 
    private data: DataService
    ) { }
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> {
    const groupId = route.params['id'];
    await this.ensureGroup(groupId);
  }

  async ensureGroup(id: string) {
    const user = await this.auth.currentUser$.pipe(
      take(1)
    ).toPromise();

    if (user === null) return;
    await this.data.ensureGroup(id);



  }
}
