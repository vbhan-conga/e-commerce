import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageCartRoutingModule } from './manage-cart-routing.module';
import { ManageCartComponent } from './layout/manage-cart.component';
import { ApttusModule } from '@apttus/core';
import { CartModule as cModule, StoreModule, PricingModule, CatalogModule } from '@apttus/ecommerce';
import { ComponentModule } from '../../components/component.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { TabsModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CartTableComponent } from './component/cart-table/cart-table.component';
import { CartSummaryComponent } from './component/cart-summary/cart-summary.component';
import { DateRangeInputComponent } from './component/date-range-input/date-range-input.component';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ConstraintRulesModule } from '@apttus/constraint-rules';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    ApttusModule,
    CommonModule,
    CatalogModule,
    ConstraintRulesModule,
    ManageCartRoutingModule,
    cModule,
    StoreModule,
    PricingModule,
    FormsModule,
    ComponentModule,
    NgxPageScrollModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    DatepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MomentModule
  ],
  declarations: [ManageCartComponent, CartTableComponent, CartSummaryComponent, DateRangeInputComponent ]
})
export class ManageCartModule { }