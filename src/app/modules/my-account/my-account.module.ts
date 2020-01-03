import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyAccountRoutingModule } from './my-account-routing.module';
import { MyAccountLayoutComponent } from './layout/my-account-layout.component';

import { OrderListComponent } from './component/order-list/order-list.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { QuoteListComponent } from './component/quote-list/quote-list.component';
import { WishlistsComponent } from './component/wishlists/wishlists.component';
import { AddressBookComponent } from './component/address-book/address-book.component';
import { SettingsComponent } from './component/settings/settings.component';
import { ComponentModule } from '../../components/component.module';

import { PricingModule } from '@apttus/ecommerce';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CartListComponent } from './component/cart-list/cart-list.component';
import { ApttusModule } from '@apttus/core';
import { OrderDetailComponent } from './component/order-detail/order-detail.component';
import { ReorderComponent } from './component/reorder/reorder.component';
import { IconModule, AddressModule, PriceModule, InputQuantityModule, ProductConfigurationSummaryModule, BreadcrumbModule, InputFieldModule, OutputFieldModule, ChartModule } from '@apttus/elements';
import { TableModule } from '@apttus/elements';


@NgModule({
  imports: [
    CommonModule,
    ApttusModule,
    MyAccountRoutingModule,
    PricingModule,
    ComponentModule,
    IconModule,
    AddressModule,
    PriceModule,
    FormsModule,
    InputQuantityModule,
    ProductConfigurationSummaryModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    BreadcrumbModule,
    InputFieldModule,
    OutputFieldModule,
    ChartModule,
    TableModule
  ],
  declarations: [MyAccountLayoutComponent, OrderListComponent, DashboardComponent, QuoteListComponent, WishlistsComponent, AddressBookComponent, SettingsComponent, CartListComponent, OrderDetailComponent, ReorderComponent],
  exports: []
})
export class MyAccountModule { }
