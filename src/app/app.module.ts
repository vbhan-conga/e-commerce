import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { ApttusModule } from '@apttus/core';
import { CommerceModule } from '@apttus/ecommerce';
// import { AppConfiguration } from './config.ts';

import { ComponentModule } from './components/component.module';
import { RouteGuard } from './services/route.guard';
import { AuthGuard } from './services/auth.guard';
import { ConfigureGuard } from './services/configure.guard';

// Register locale data
import localeMx from '@angular/common/locales/es-MX';
import localeMxExtra from '@angular/common/locales/extra/es-MX';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeMx, 'es-MX', localeMxExtra);


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentModule,
    // ApttusModule.forRoot(AppConfiguration),
    // CommerceModule.forRoot('Storefront Name')
  ],
  providers: [RouteGuard, AuthGuard, ConfigureGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
