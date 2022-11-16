import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { filterNotNull } from 'src/app/tools/is-not-null';
import { DialogsService } from 'src/app/services/dialogs.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  currentUser$!: Observable<User>;
  userGroups$!: Observable<Group[]>;
  admin$!: Observable<boolean>;
  super$!: Observable<boolean>;

  displayNameBusy: boolean = false;
  photoBusy: boolean = false;

  constructor(
    private authService: AuthService,
    private db: AngularFirestore, 
    private api: ApiService, 
    private dialogs: DialogsService) { }

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$.pipe(
      filterNotNull(), 
      tap(_ => {
        this.photoBusy = false;
        this.displayNameBusy = false;
      })
    );

    const allGroups$ = this.db.collection<Group>('groups').valueChanges();
    this.userGroups$ = combineLatest([allGroups$, this.currentUser$]).pipe(
      map(([all, user]) => all.filter(g => user.groups && user.groups.includes(g.id)))
    );

    this.admin$ = this.authService.isAdmin$;
    this.super$ = this.authService.isSuper$;
  }

  async editDisplayName() {

    const user = await this.currentUser$.pipe(first()).toPromise();
    const res = await this.dialogs.prompt('Name', user.displayName);

    if (res && (res !== user.displayName)) {
      const newUser:User = {
        ...user, 
        displayName: res
      };

      this.displayNameBusy = true;
      this.api.updateUser(newUser);
    }
  }

  async editPhotoUrl() {

    const user = await this.currentUser$.pipe(first()).toPromise();
    const res = await this.dialogs.prompt('Photo Url', user.photoUrl);

    if (res && (res !== user.photoUrl)) {
      const newUser:User = {
        ...user, 
        photoUrl: res
      };

      this.photoBusy = true;
      this.api.updateUser(newUser);
    }
  }

}
