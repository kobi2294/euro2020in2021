import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Audit } from '../models/audit.model';
import { StringMapping, toStringMapping } from '../tools/mappings';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SuperService {
  readonly userAudit$!: Observable<StringMapping<Audit>>;

  constructor(private db: AngularFirestore) {
    this.userAudit$ = this.db
      .collection<Audit>('audits')
      .valueChanges()
      .pipe(map((all) => toStringMapping(all, (a) => a.email)));
  }
}
