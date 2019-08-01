import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SlickModule } from 'ngx-slick';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { FormsModule }   from '@angular/forms';
import { NavAccountComponent } from './nav-account/nav-account.component';
import { ApttusModule } from '@apttus/core';
import { FooterComponent } from './footer/footer.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AttachmentComponent } from './attachment/attachment.component';
import { PricingModule } from '@apttus/ecommerce';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ToastrModule } from 'ngx-toastr';

import { MiniProfileModule, MiniCartModule, ConstraintIconModule, ConstraintSideMenuModule, IconModule, PriceModule } from '@apttus/elements';

import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AutoFocusDirective } from '../directives/auto-focus.directive';

@NgModule({
  imports: [
    CommonModule,
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
    PricingModule,
    IconModule,
    PriceModule,
    NgScrollbarModule,
    TooltipModule.forRoot(),
    ToastrModule.forRoot({ onActivateTick: true })
  ],
  exports : [
    HeaderComponent,
    LaddaModule,
    FooterComponent,
    ToastrModule,
    AutoFocusDirective
  ],
  declarations: [
    HeaderComponent,
    NavAccountComponent,
    FooterComponent,
    AttachmentComponent,
    AutoFocusDirective
  ]
})
export class ComponentModule { }
