import { environment } from 'src/environments/environment';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/functions';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { RouteRulesService } from './services/route-rules.service';
import { AuthInterceptor } from './services/auth-interceptor';
import { PwaService } from './services/pwa.service';

import { AppComponent } from './app.component';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { DataDeletionPageComponent } from './components/pages/data-deletion-page/data-deletion-page.component';
import { GuessesPageComponent } from './components/pages/guesses-page/guesses-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { InfoPageComponent } from './components/pages/info-page/info-page.component';
import { HelpComponent } from './components/pages/info-page/help/help.component';
import { AboutMeComponent } from './components/pages/info-page/about-me/about-me.component';
import { RulesComponent } from './components/pages/info-page/rules/rules.component';
import { JoinGroupPageComponent } from './components/pages/join-group-page/join-group-page.component';
import { LegalPageComponent } from './components/pages/legal-page/legal-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { PrivacyPageComponent } from './components/pages/privacy-page/privacy-page.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { ScoreboardPageComponent } from './components/pages/scoreboard-page/scoreboard-page.component';
import { PromptDialogComponent } from './components/dialogs/prompt-dialog/prompt-dialog.component';
import { NavBarComponent } from './components/parts/nav-bar/nav-bar.component';
import { PwaMessageComponent } from './components/parts/pwa-message/pwa-message.component';
import { ContentComponent } from './components/widgets/content/content.component';
import { CountryComponent } from './components/widgets/country/country.component';
import { FlagComponent } from './components/widgets/flag/flag.component';
import { GroupSelectorComponent } from './components/widgets/group-selector/group-selector.component';
import { OnOffPendingButtonComponent } from './components/widgets/on-off-pending-button/on-off-pending-button.component';
import { SpinnerComponent } from './components/widgets/spinner/spinner.component';
import { SuperPageComponent } from './components/pages/super-page/super-page.component';




const app = firebase.initializeApp(environment.firebase, 'euro2020at2021');
if (!environment.production) {
  app.auth().useEmulator('http://localhost:9099');
  app.firestore().useEmulator('localhost', 8080);
  app.functions().useEmulator('localhost', 5001);
}

@NgModule({
  declarations: [
    // pages
    AppComponent,
    AdminPageComponent,
    DataDeletionPageComponent,
    GuessesPageComponent,
    HomePageComponent,
    InfoPageComponent,
    HelpComponent,
    AboutMeComponent,
    RulesComponent,
    JoinGroupPageComponent,
    LegalPageComponent,
    LoginPageComponent,
    PrivacyPageComponent,
    ProfilePageComponent,
    ScoreboardPageComponent,
    SuperPageComponent,

    // dialogs
    PromptDialogComponent,

    // parts
    NavBarComponent,
    PwaMessageComponent,

    // widgets
    ContentComponent,
    CountryComponent,
    FlagComponent,
    GroupSelectorComponent,
    OnOffPendingButtonComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'euro2020at2021'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER, useFactory: (service: RouteRulesService) => () => service.init(),
      deps: [RouteRulesService],
      multi: true
    },
    {
      provide: APP_INITIALIZER, useFactory: (service: PwaService) => () => service.init(), 
      deps: [PwaService], 
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, 
    { provide: USE_AUTH_EMULATOR, useValue: environment.production ? undefined : ['localhost', 9099] },
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.production ? undefined : ['localhost', 8080] },
    { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.production ? undefined : ['localhost', 5001] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
