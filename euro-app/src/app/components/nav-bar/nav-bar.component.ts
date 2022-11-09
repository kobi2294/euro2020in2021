import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  isAdmin$!: Observable<boolean>;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.isAdmin$ = this.auth.isAdmin$;
  }

}
