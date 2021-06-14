import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './services/auth.service';
import { ProfileComponent } from './components/profile/profile.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { GuessesComponent } from './components/guesses/guesses.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouteRulesService } from './services/route-rules.service';
import { AuthInterceptor } from './services/auth-interceptor';

import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/functions';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    NavBarComponent,
    GuessesComponent,
    ScoreboardComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER, useFactory: (service: RouteRulesService) => () => service.init(),
      deps: [RouteRulesService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, 
      multi: true
    }, 
    { provide: USE_AUTH_EMULATOR, useValue: environment.production ? undefined : ['localhost', 9099] },
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.production ? undefined : ['localhost', 8080] },
    { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.production ? undefined : ['localhost', 5001] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
