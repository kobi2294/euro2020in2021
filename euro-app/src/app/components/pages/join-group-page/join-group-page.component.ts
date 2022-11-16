import { ObserversModule } from '@angular/cdk/observers';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-join-page-group',
  templateUrl: './join-group-page.component.html',
  styleUrls: ['./join-group-page.component.scss']
})
export class JoinGroupPageComponent implements OnInit {
  group$!: Observable<string>; 

  constructor(
    private route: ActivatedRoute, 
    private data: DataService) { }

  ngOnInit(): void {
    this.group$ = this.route.params.pipe(
      map(prms => prms['id']), 
      withLatestFrom(this.data.allGroups$), 
      map(([id, all]) => all.find(g => g.id === id)?.displayName ?? 'Unknown')
    )
  }

}
