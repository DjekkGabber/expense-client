import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {StatisticsComponent} from "./statistics/statistics.component";
import {ProfileComponent} from "./profile/profile.component";
import {Page404Component} from "./page404/page404.component";
import {LoginComponent} from "./login/login.component";
import {BaseComponent} from "./base/base.component";

const routes: Routes = [
  { path: '', redirectTo: '/main/dashboard', pathMatch: 'full' },
  { path: 'main', component: BaseComponent,
    children:[
      { path: 'dashboard', component: HomeComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  },
  { path: 'login', component:  LoginComponent},
  { path: '**', component:  Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
