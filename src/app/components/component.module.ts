import { AboModule } from '@apttus/abo';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SlickModule } from 'ngx-slick';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { FormsModule }   from '@angular/forms';
import { NavAccountComponent } from './nav-account/nav-account.component';
import { ApttusModule } from '@apttus/core';
import { FooterComponent } from './footer/footer.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { StoreModule, CartModule, PricingModule, CatalogModule, CrmModule } from '@apttus/ecommerce';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { ToastrModule } from 'ngx-toastr';
import { ConstraintRulesModule } from '@apttus/constraint-rules';
import { DirectivesModule } from '../directives/directive.module';

import { MiniProfileModule, MiniCartModule, ConstraintIconModule, ConstraintSideMenuModule, MdSpinnerModule, PriceModule } from '@apttus/elements';

@NgModule({
  imports: [
    CommonModule,
    LazyLoadImageModule,
    SlickModule,
    MiniProfileModule,
    MiniCartModule,
    ConstraintIconModule,
    ConstraintSideMenuModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    LaddaModule,
    RouterModule,
    FormsModule,
    ApttusModule,
    StoreModule,
    CartModule,
    PricingModule,
    ConstraintRulesModule,
    DirectivesModule,
    AboModule,
    MdSpinnerModule,
    PriceModule,
    ToastrModule.forRoot({ onActivateTick: true })
  ],
  exports : [
    HeaderComponent,
    LazyLoadImageModule,
    LaddaModule,
    CatalogModule,
    FooterComponent,
    ToastrModule,
    DirectivesModule
  ],
  declarations: [
    HeaderComponent,
    NavAccountComponent,
    FooterComponent
  ]
})
export class ComponentModule { }
