import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { DataDeletionComponent } from './components/data-deletion/data-deletion.component';
import { GuessesComponent } from './components/guesses/guesses.component';
import { HomeComponent } from './components/home/home.component';
import { LegalComponent } from './components/legal/legal.component';
import { LoginComponent } from './components/login/login.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';

const routes: Routes = [
  {path: '', redirectTo: 'scoreboard', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, data: {animationOrder: '0'}}, 
  {path: 'home', component: HomeComponent, data: {animationOrder: '1'}}, 
  {path: 'scoreboard', component: ScoreboardComponent, data: {animationOrder: '2'}}, 
  {path: 'guesses', component: GuessesComponent, data: {animationOrder: '3'}}, 
  {path: 'profile', component: ProfileComponent, data: {animationOrder: '4'}}, 
  {path: 'admin', component: AdminComponent, data: {animationOrder: '5'}}, 
  {path: 'legal', component: LegalComponent, data: {animationOrder: '6'}}, 
  {path: 'privacy', component: PrivacyComponent, data: {animationOrder: '7'}}, 
  {path: 'datadel', component: DataDeletionComponent, data: {amimationOrder: '8'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
