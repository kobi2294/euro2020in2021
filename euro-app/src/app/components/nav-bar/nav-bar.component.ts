import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  isAdmin$!: Observable<boolean>;

  hasGroups$!: Observable<boolean>;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.isAdmin$ = this.auth.isAdmin$;
    this.hasGroups$ = this.auth.currentUser$.pipe(
      map(user => (user?.groups?.length ?? 0) > 0)
    )
  }

}
