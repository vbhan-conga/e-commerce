import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './layout/home.component';
import { ComponentModule } from '../../components/component.module';
import { CatalogModule, StoreModule } from '@apttus/ecommerce';

import { ConstraintRulesModule } from '@apttus/constraint-rules';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    ComponentModule,
    CatalogModule,
    StoreModule,
    ConstraintRulesModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
