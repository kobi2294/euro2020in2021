import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(
    private db: AngularFirestore, 
    private auth: AngularFireAuth
    ) { }

  ngOnInit(): void {
  }

  go() {
    this.db.collection('groups').doc('hari').valueChanges().subscribe(val => console.log(val));
  }

}
