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
import { ConstraintRuleGuard } from './services/constraint-rule.guard';

// Register locale data
import localeMx from '@angular/common/locales/es-MX';
import localeMxExtra from '@angular/common/locales/extra/es-MX';
import { registerLocaleData } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
registerLocaleData(localeMx, 'es-MX', localeMxExtra);


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentModule,
    ServiceWorkerModule

    // Uncomment these lines to import the apttus core and ecommerce and constraint-rules modules
    // ApttusModule.forRoot(AppConfig),
    // CommerceModule.forRoot('Storefront Name'),
    // ConstraintRulesModule
  ],
  providers: [RouteGuard, AuthGuard, ConfigureGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
