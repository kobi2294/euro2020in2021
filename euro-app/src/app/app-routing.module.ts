import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { GroupsComponent } from './components/groups/groups.component';
import { GuessesComponent } from './components/guesses/guesses.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent}, 
  {path: 'home', component: HomeComponent}, 
  {path: 'profile', component: ProfileComponent}, 
  {path: 'groups', component: GroupsComponent}, 
  {path: 'guesses', component: GuessesComponent}, 
  {path: 'scoreboard', component: ScoreboardComponent}, 
  {path: 'admin', component: AdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
