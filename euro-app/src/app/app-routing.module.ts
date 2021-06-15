import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { GuessesComponent } from './components/guesses/guesses.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';

const routes: Routes = [
  {path: '', redirectTo: 'guesses', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, data: {animationOrder: '0'}}, 
  {path: 'profile', component: ProfileComponent, data: {animationOrder: '1'}}, 
  {path: 'guesses', component: GuessesComponent, data: {animationOrder: '2'}}, 
  {path: 'scoreboard', component: ScoreboardComponent, data: {animationOrder: '3'}}, 
  {path: 'admin', component: AdminComponent, data: {animationOrder: '4'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
