import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './layout/cart.component';
import { SummaryComponent } from './component/summary.component';

import { ProductConfigurationSummaryModule,PaymentComponentModule, OutputFieldModule, MiniProfileModule, BreadcrumbModule, PriceSummaryModule, InputFieldModule } from '@apttus/elements';
import { ComponentModule } from '../../components/component.module';
import { CardFormComponent } from './component/card-form/card-form.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AddressModule, PriceModule, IconModule } from '@apttus/elements';
import { TranslateModule } from '@ngx-translate/core'; 
import { ApttusModule } from '@apttus/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
    CommonModule,
    CartRoutingModule,
    FormsModule,
    ComponentModule,
    ProductConfigurationSummaryModule,
    PriceModule,
    IconModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    AddressModule,
    ApttusModule,
    PaymentComponentModule,
    OutputFieldModule,
    TooltipModule.forRoot(),
    TranslateModule.forChild(),    
    BsDropdownModule.forRoot(),
    MiniProfileModule,
    BreadcrumbModule,
    PriceSummaryModule,
    InputFieldModule
  ],
  declarations: [CartComponent, SummaryComponent,CardFormComponent]
})
export class CartModule { }
