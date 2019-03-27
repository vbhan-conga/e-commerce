import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApttusModule } from '@apttus/core';
import { ComponentModule } from '../../components/component.module';
import { CompareRoutingModule } from './compare-routing.module';
import { CompareLayoutComponent } from './layout/compare-layout.component';
import { PricingModule, CartModule, StoreModule, CatalogModule } from '@apttus/ecommerce';
import { ProductCardModule, MdSpinnerModule, ProductCompareModule } from '@apttus/elements';

@NgModule({
  imports: [
    CommonModule,
    CompareRoutingModule,
    CatalogModule,
    PricingModule,
    CartModule,
    StoreModule,
    ApttusModule,
    ComponentModule,
    ProductCardModule,
    MdSpinnerModule,
    ProductCompareModule
  ],
  declarations: [
    CompareLayoutComponent,
  ]
})
export class CompareModule {}
