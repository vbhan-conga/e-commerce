import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SlickModule } from 'ngx-slick';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { FormsModule }   from '@angular/forms';
import { NavAccountComponent } from './nav-account/nav-account.component';
import { FooterComponent } from './footer/footer.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ApttusModule } from '@apttus/core';
import { StoreModule, CartModule, PricingModule } from '@apttus/ecommerce';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ItemConfigurationSummaryComponent } from './item-configuration-summary/item-configuration-summary.component';

@NgModule({
  imports: [
    CommonModule,
    LazyLoadImageModule,
    SlickModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    LaddaModule,
    RouterModule,
    FormsModule,
    ApttusModule,
    StoreModule,
    CartModule,
    PricingModule
  ],
  exports : [
    HeaderComponent,
    LazyLoadImageModule,
    LaddaModule,
    FooterComponent,
    ItemConfigurationSummaryComponent
  ],
  declarations: [
    HeaderComponent,
    NavAccountComponent,
    FooterComponent,
    ItemConfigurationSummaryComponent
  ]
})
export class ComponentModule { }
