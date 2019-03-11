import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponentComponent } from './component/home-component/home-component.component';
import { OktaCallbackComponent } from './component/okta-callback/okta-callback.component';
import { LoginComponent } from './component/login/login.component';
import { NewComponent } from './component/new/new.component';
import { NewSourceComponent } from './component/new-source/new-source.component';

const routes: Routes = [
  {path: '' , redirectTo: 'login', pathMatch: 'full'},
  {path: 'login' , component: LoginComponent},
  {path: 'home' , component: HomeComponentComponent},
  {path: 'news' , component: NewComponent},
  {path: 'news/:source' , component: NewSourceComponent},


  {path: 'implicit/callback' , component: OktaCallbackComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
