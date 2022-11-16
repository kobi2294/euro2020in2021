import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { DataDeletionPageComponent } from './components/pages/data-deletion-page/data-deletion-page.component';
import { GuessesPageComponent } from './components/pages/guesses-page/guesses-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { AboutMeComponent } from './components/pages/info-page/about-me/about-me.component';
import { HelpComponent } from './components/pages/info-page/help/help.component';
import { InfoPageComponent } from './components/pages/info-page/info-page.component';
import { RulesComponent } from './components/pages/info-page/rules/rules.component';
import { JoinGroupPageComponent } from './components/pages/join-group-page/join-group-page.component';
import { LegalPageComponent } from './components/pages/legal-page/legal-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { PrivacyPageComponent } from './components/pages/privacy-page/privacy-page.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { ScoreboardPageComponent } from './components/pages/scoreboard-page/scoreboard-page.component';
import { SuperPageComponent } from './components/pages/super-page/super-page.component';
import { JoinGroupService } from './services/join-group.service';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'group/:id', component:JoinGroupPageComponent, resolve: {group: JoinGroupService}},
  {path: 'login', component: LoginPageComponent, data: {animationOrder: '0'}}, 
  {path: 'home', component: HomePageComponent, data: {animationOrder: '1'}}, 
  {path: 'info', component: InfoPageComponent, data: {animationOrder: '2'}, children: [
    {path: '', redirectTo: 'rules', pathMatch: 'full'},
    {path: 'rules', component: RulesComponent}, 
    {path: 'help', component: HelpComponent}, 
    {path: 'contact', component: AboutMeComponent}
  ]},
  {path: 'scoreboard', component: ScoreboardPageComponent, data: {animationOrder: '3'}}, 
  {path: 'guesses', component: GuessesPageComponent, data: {animationOrder: '4'}}, 
  {path: 'profile', component: ProfilePageComponent, data: {animationOrder: '5'}}, 
  {path: 'admin', component: AdminPageComponent, data: {animationOrder: '6'}}, 
  {path: 'super', component: SuperPageComponent, data: {animationOrder: '7'}},
  {path: 'legal', component: LegalPageComponent }, 
  {path: 'privacy', component: PrivacyPageComponent }, 
  {path: 'datadel', component: DataDeletionPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
