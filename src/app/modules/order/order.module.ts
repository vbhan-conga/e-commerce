import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OutputFieldModule,
  PriceModule,
  LineItemTableRowModule,
  BreadcrumbModule,
  PriceSummaryModule,
  IconModule
} from '@apttus/elements';

import { OrderDetailsComponent } from './layout/order-details/order-details.component';
import { OrderRoutingModule } from './order-routing.module';
import { DetailsModule } from '../details/details.module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    DetailsModule,
    OrderRoutingModule,
    OutputFieldModule,
    PriceModule,
    BreadcrumbModule,
    LineItemTableRowModule,
    TranslateModule.forChild(),
    PriceSummaryModule,
    IconModule
  ],
  declarations: [OrderDetailsComponent]
})
export class OrderModule { }
