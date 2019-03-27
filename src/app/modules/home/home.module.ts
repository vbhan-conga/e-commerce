import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './layout/home.component';
import { ComponentModule } from '../../components/component.module';
import { CatalogModule, StoreModule } from '@apttus/ecommerce';

import { ConstraintRulesModule } from '@apttus/constraint-rules';
import { ProductCarouselModule, JumbotronModule } from '@apttus/elements';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    ComponentModule,
    JumbotronModule,
    CatalogModule,
    StoreModule,
    ConstraintRulesModule,
    ProductCarouselModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
