import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import {MaterialModule} from './material.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomeComponentComponent } from './component/home-component/home-component.component';
import { OktaCallbackComponent } from './component/okta-callback/okta-callback.component';
import { LoginComponent } from './component/login/login.component';
import { NewComponent } from './component/new/new.component';
import { NewSourceComponent } from './component/new-source/new-source.component';

import { HttpConfigInterceptor} from './core/services/http-interceptor';
import { LoaderComponent } from './component/loader/loader.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponentComponent,
    OktaCallbackComponent,
    LoginComponent,
    NewComponent,
    NewSourceComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    FooterComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
]
,
  bootstrap: [AppComponent],
  exports: [HeaderComponent, FooterComponent, HomeComponentComponent, OktaCallbackComponent, NewComponent, LoaderComponent]
})
export class AppModule { }
