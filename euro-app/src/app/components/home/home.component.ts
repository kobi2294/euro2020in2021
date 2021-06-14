import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(
    private db: AngularFirestore, 
    private auth: AngularFireAuth, 
    private funcs: FunctionsService
    ) { }

  ngOnInit(): void {
  }

  async go() {
    let res = await this.funcs.helloWorld();
    console.log('server returned: ', res);
  }

}
