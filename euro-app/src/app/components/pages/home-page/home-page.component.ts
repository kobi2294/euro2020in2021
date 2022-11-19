import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { ExtendedScore } from 'src/app/models/extended-score.model';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SelectedGroupService } from 'src/app/services/selected-group.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  userNull$!: Observable<boolean>;
  hasGroups$!: Observable<boolean>;


  constructor(
    private groupService: SelectedGroupService, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.hasGroups$ = this.groupService.userHasGroups$;
    this.userNull$ = this.authService.currentUser$.pipe(
      map(u => u === null), 
      startWith(true)
    );
  }


}
