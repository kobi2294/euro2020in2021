import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stage } from 'src/app/models/stage.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  stages$!: Observable<Stage[]>;

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.stages$ = this.data.allStages$.pipe(
      map(all => all.sort((a, b) => a.points - b.points))
    );
  }

}
