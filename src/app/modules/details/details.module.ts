import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApttusModule } from '@apttus/core';
import { PricingModule } from '@apttus/ecommerce';
import { BreadcrumbModule, MdDotsModule, InputDateModule, PriceModule, PromotionModule, PromotionAppliedtoLineitemModule, ProductConfigurationSummaryModule } from '@apttus/elements';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsLayoutComponent } from './layout/details-layout.component';
import { LineItemDetailsComponent } from './component/line-item-details/line-item-details.component';
import { SummaryDetailsComponent } from './component/summary-details/summary-details.component';
import { PriceSummaryComponent } from './component/price-summary/price-summary.component'; 


@NgModule({
  imports: [
    CommonModule,
    DetailsRoutingModule,
    BreadcrumbModule,
    ApttusModule,
    MdDotsModule,
    InputDateModule,
    PriceModule,
    PromotionModule,
    PromotionAppliedtoLineitemModule,
    PricingModule,
    ProductConfigurationSummaryModule
  ],
  declarations: [DetailsLayoutComponent, LineItemDetailsComponent, SummaryDetailsComponent, PriceSummaryComponent]
})
export class DetailsModule { }