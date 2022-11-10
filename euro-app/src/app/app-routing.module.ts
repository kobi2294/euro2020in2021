import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { DataDeletionComponent } from './components/data-deletion/data-deletion.component';
import { GuessesComponent } from './components/guesses/guesses.component';
import { HomeComponent } from './components/home/home.component';
import { JoinGroupComponent } from './components/join-group/join-group.component';
import { LegalComponent } from './components/legal/legal.component';
import { LoginComponent } from './components/login/login.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RulesComponent } from './components/rules/rules.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { JoinGroupService } from './services/join-group.service';

const routes: Routes = [
  {path: '', redirectTo: 'scoreboard', pathMatch: 'full'},
  {path: 'group/:id', component:JoinGroupComponent, resolve: {group: JoinGroupService}},
  {path: 'login', component: LoginComponent, data: {animationOrder: '0'}}, 
  {path: 'home', component: HomeComponent, data: {animationOrder: '1'}}, 
  {path: 'rules', component: RulesComponent, data: {animationOrder: '2'}},
  {path: 'scoreboard', component: ScoreboardComponent, data: {animationOrder: '3'}}, 
  {path: 'guesses', component: GuessesComponent, data: {animationOrder: '4'}}, 
  {path: 'profile', component: ProfileComponent, data: {animationOrder: '5'}}, 
  {path: 'admin', component: AdminComponent, data: {animationOrder: '6'}}, 
  {path: 'legal', component: LegalComponent }, 
  {path: 'privacy', component: PrivacyComponent }, 
  {path: 'datadel', component: DataDeletionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
