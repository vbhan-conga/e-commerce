import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { NavAccountComponent } from './nav-account/nav-account.component';
import { ApttusModule } from '@congacommerce/core';
import { FooterComponent } from './footer/footer.component';
import { AttachmentComponent } from './attachment/attachment.component';
import { PricingModule } from '@congacommerce/ecommerce';
import { ToastrModule } from 'ngx-toastr';

import { MiniProfileModule, MiniCartModule, ConstraintRuleModule,
  IconModule, PriceModule, DirectivesModule, ProductSearchModule, PriceModalModule } from '@congacommerce/elements';

import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CategoryCarouselComponent } from './category-carousel/category-carousel.component';

@NgModule({
  imports: [
    CommonModule,
    MiniProfileModule,
    MiniCartModule,
    ConstraintRuleModule,
    LaddaModule,
    RouterModule,
    ApttusModule,
    PricingModule,
    IconModule,
    PriceModule,
    NgScrollbarModule,
    TooltipModule.forRoot(),
    ToastrModule.forRoot({ onActivateTick: true }),
    DirectivesModule,
    ProductSearchModule,
    PriceModalModule
  ],
  exports : [
    HeaderComponent,
    LaddaModule,
    FooterComponent,
    ToastrModule
  ],
  declarations: [
    HeaderComponent,
    NavAccountComponent,
    FooterComponent,
    AttachmentComponent,
    CategoryCarouselComponent
  ]
})
export class ComponentModule { }
