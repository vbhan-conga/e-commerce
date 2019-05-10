import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './layout/cart.component';
import { SummaryComponent } from './component/summary.component';

import { CartModule as cModule, StoreModule, PricingModule } from '@apttus/ecommerce';
import { ProductConfigurationSummaryModule } from '@apttus/elements';
import { CybersourceComponent } from './component/cybersource/cybersource.component';
import { ComponentModule } from '../../components/component.module';
import { CardFormComponent } from './component/card-form/card-form.component';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddressModule, PriceModule, MdSpinnerModule } from '@apttus/elements';

@NgModule({
  imports: [
    CommonModule,
    CartRoutingModule,
    cModule,
    StoreModule,
    PricingModule,
    FormsModule,
    ComponentModule,
    NgxPageScrollModule,
    ProductConfigurationSummaryModule,
    PriceModule,
    MdSpinnerModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    AddressModule,
    TooltipModule.forRoot(),
  ],
  declarations: [CartComponent, SummaryComponent, CybersourceComponent, CardFormComponent]
})
export class CartModule { }
