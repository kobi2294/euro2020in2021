import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PwaService } from 'src/app/services/pwa.service';

@Component({
  selector: 'app-pwa-message',
  templateUrl: './pwa-message.component.html',
  styleUrls: ['./pwa-message.component.scss']
})
export class PwaMessageComponent implements OnInit {

  showInstall$!: Observable<boolean>;
  showIos$!: Observable<boolean>;
  showMessage$!: Observable<boolean>;

  showingMessage: boolean = false;

  constructor(
    private pwa: PwaService
  ) { }

  ngOnInit(): void {
    this.showInstall$ = this.pwa.showInstall$;
    this.showIos$ = this.pwa.showIosMessage$;

    this.showMessage$ = combineLatest([this.showInstall$, this.showIos$]).pipe(
      map(([a, b]) => a || b), 
      tap(async val => {
        await new Promise(res => setTimeout(res, 10));
        this.showingMessage = val;
      })
    );
  }

  async installLocally() {
    await this.pwa.install();
    
  }

}
