import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApttusModule } from '@apttus/core';
import { CommerceModule } from '@apttus/ecommerce';
import { ConstraintRulesModule } from '@apttus/constraint-rules';

// import { AppConfig } from './config';
import { ComponentModule } from './components/component.module';
import { RouteGuard } from './services/route.guard';
import { AuthGuard } from './services/auth.guard';
import { ConfigureGuard } from './services/configure.guard';
import { environment } from '../environments/environment';
import { ConstraintRuleGuard } from './services/constraint-rule.guard';

// Register locale data
import localeMx from '@angular/common/locales/es-MX';
import localeMxExtra from '@angular/common/locales/extra/es-MX';
import { registerLocaleData } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ModalModule } from 'ngx-bootstrap/modal';

registerLocaleData(localeMx, 'es-MX', localeMxExtra);


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ApttusModule.forRoot(environment),

    // Set the storefront to use here
    CommerceModule.forRoot('My Storefront'),
    ModalModule.forRoot(),
    ComponentModule,
    ConstraintRulesModule,
    ServiceWorkerModule
  ],
  providers: [RouteGuard, AuthGuard, ConfigureGuard, ConstraintRuleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
