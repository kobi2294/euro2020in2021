import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SelectedGroupService } from 'src/app/services/selected-group.service';
import { browseableGroups } from 'src/app/tools/user-functions';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  isAdmin$!: Observable<boolean>;

  isSuper$!: Observable<boolean>;

  canSeeGroups$!: Observable<boolean>;

  canBet$!: Observable<boolean>;

  emptyGuessesBadge$!: Observable<number>;

  hideBadge$!: Observable<boolean>;

  constructor(
    private auth: AuthService, 
    private data: DataService,
    private groups: SelectedGroupService
    ) { }

  ngOnInit(): void {
    this.isAdmin$ = this.auth.isAdmin$;

    this.isSuper$ = this.auth.isSuper$;

    this.canSeeGroups$ = combineLatest([this.auth.currentUser$, this.auth.isSuper$, this.groups.allGroups$]).pipe(
      map(([user, isSuper, groups]) => browseableGroups(user, isSuper, groups).length > 0)
    );

    this.canBet$ = this.auth.currentUser$.pipe(
      map(user => (user?.groups??[]).length > 0 )
    );

    this.emptyGuessesBadge$ = this.data.myNextGuesses$.pipe(
      map(guesses => (guesses ??[]).filter(g => !g.guess).length)
    );

    this.hideBadge$ = this.emptyGuessesBadge$.pipe(
      map(c => !c)
    );
    
  }

}
