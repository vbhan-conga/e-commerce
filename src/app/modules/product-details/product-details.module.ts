import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComponentModule } from '../../components/component.module';
import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { ProductDetailsComponent } from './layout/product-details.component';

import { NgxGalleryModule } from 'ngx-gallery';

import { CartModule, CatalogModule, PricingModule, StoreModule } from '@apttus/ecommerce';
import { ApttusModule } from '@apttus/core';
import { ConstraintRulesModule } from '@apttus/constraint-rules';

import { TabFeaturesComponent } from './component/tab-features.component';
import { TabAttachmentsComponent } from './component/tab-attachments.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProductReplacementsComponent } from './component/product-replacements.component';


import { ConfigureGuard } from '../../services/configure.guard';
import { BreadcrumbModule, ButtonModule, PriceModule, ProductCarouselModule, ProductConfigurationModule, MdSpinnerModule, InputDateModule, ProductImagesModule } from '@apttus/elements';


@NgModule({
  imports: [
    CommonModule,
    BreadcrumbModule,
    ProductCarouselModule,
    ProductConfigurationModule,
    MdSpinnerModule,
    ButtonModule,
    ProductImagesModule,
    PriceModule,
    FormsModule,
    ProductDetailsRoutingModule,
    NgxGalleryModule,
    ComponentModule,
    CartModule,
    CatalogModule,
    PricingModule,
    StoreModule,
    ApttusModule,
    ConstraintRulesModule,
    TabsModule.forRoot(),
    InputDateModule
  ],
  providers : [ConfigureGuard],
  declarations: [ProductDetailsComponent,
                TabFeaturesComponent,
                ProductReplacementsComponent,
                TabAttachmentsComponent]
})
export class ProductDetailsModule { }
