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

@NgModule({
  imports: [
    ApttusModule,
    CommonModule,
    CatalogModule,
    ManageCartRoutingModule,
    cModule,
    StoreModule,
    PricingModule,
    FormsModule,
    ComponentModule,
    NgxPageScrollModule,
    TabsModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [ManageCartComponent, CartTableComponent, CartSummaryComponent ]
})
export class ManageCartModule { }


