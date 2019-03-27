import { AboModule } from '@apttus/abo';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageCartRoutingModule } from './manage-cart-routing.module';
import { ManageCartComponent } from './layout/manage-cart.component';
import { ApttusModule } from '@apttus/core';
import { CartModule as cModule, StoreModule, PricingModule, CatalogModule } from '@apttus/ecommerce';
import { ComponentModule } from '../../components/component.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CartTableComponent } from './component/cart-table/cart-table.component';
import { CartSummaryComponent } from './component/cart-summary/cart-summary.component';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ConstraintRulesModule } from '@apttus/constraint-rules';
import { ProductCarouselModule, ConstraintAlertModule, ProductConfigurationSummaryModule, PriceModule, PromotionAppliedtoLineitemModule, PromotionModule, InputDateModule } from '@apttus/elements';


@NgModule({
  imports: [
    ApttusModule,
    CommonModule,
    CatalogModule,
    ConstraintRulesModule,
    PromotionModule,
    ManageCartRoutingModule,
    cModule,
    ProductCarouselModule,
    StoreModule,
    PricingModule,
    FormsModule,
    ComponentModule,
    NgxPageScrollModule,
    ConstraintAlertModule,
    ProductConfigurationSummaryModule,
    PriceModule,
    PromotionAppliedtoLineitemModule,
    PromotionModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    DatepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    AboModule,
    InputDateModule
  ],
  declarations: [ManageCartComponent, CartTableComponent, CartSummaryComponent ]
})
export class ManageCartModule { }