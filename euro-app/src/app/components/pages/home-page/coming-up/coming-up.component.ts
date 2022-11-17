import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Match } from 'src/app/models/match.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-coming-up',
  templateUrl: './coming-up.component.html',
  styleUrls: ['./coming-up.component.scss']
})
export class ComingUpComponent implements OnInit {
  comingUp$!: Observable<Match[]>

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.comingUp$ = this.data.comingUpMatches$;
  }

}
