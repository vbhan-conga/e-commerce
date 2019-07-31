import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApttusModule } from '@apttus/core';
import { ComponentModule } from '../../components/component.module';
import { CompareRoutingModule } from './compare-routing.module';
import { CompareLayoutComponent } from './layout/compare-layout.component';
import { PricingModule } from '@apttus/ecommerce';
import { ProductCardModule, IconModule, ProductCompareModule } from '@apttus/elements';

@NgModule({
  imports: [
    CommonModule,
    CompareRoutingModule,
    PricingModule,
    ApttusModule,
    ComponentModule,
    ProductCardModule,
    IconModule,
    ProductCompareModule
  ],
  declarations: [
    CompareLayoutComponent,
  ]
})
export class CompareModule {}
