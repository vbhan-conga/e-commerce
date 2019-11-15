import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageCartRoutingModule } from './manage-cart-routing.module';
import { ManageCartComponent } from './layout/manage-cart.component';
import { ApttusModule } from '@apttus/core';
import { PricingModule } from '@apttus/ecommerce';
import { ComponentModule } from '../../components/component.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CartTableComponent } from './component/cart-table/cart-table.component';
import { CartSummaryComponent } from './component/cart-summary/cart-summary.component';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ProductCarouselModule, ConstraintAlertModule, ProductConfigurationSummaryModule, PriceModule, PromotionModule, InputDateModule, LineItemTableRowModule, BreadcrumbModule, IconModule, TaxPopHoverModule, PriceSummaryModule, AlertModule } from '@apttus/elements';
import { TranslateModule } from '@ngx-translate/core'; 
import { QuoteModule } from '../quote/quote.module';

@NgModule({
  imports: [
    ApttusModule,
    CommonModule,
    PromotionModule,
    ManageCartRoutingModule,
    ProductCarouselModule,
    PricingModule,
    FormsModule,
    ComponentModule,
    ConstraintAlertModule,
    ProductConfigurationSummaryModule,
    PriceModule,
    AlertModule,
    PromotionModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    DatepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    InputDateModule,
    TranslateModule.forChild(),
    LineItemTableRowModule,
    QuoteModule,
    BreadcrumbModule,
    IconModule,
    PriceSummaryModule,
    TaxPopHoverModule
  ],
  declarations: [ManageCartComponent, CartTableComponent, CartSummaryComponent]
})
export class ManageCartModule { }