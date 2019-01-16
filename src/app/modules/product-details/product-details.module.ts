import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from '../../components/component.module';
import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { ProductDetailsComponent } from './layout/product-details.component';

import { ProductImagesComponent } from './component/product-images.component';
import { NgxGalleryModule } from 'ngx-gallery';

import { CartModule, CatalogModule, PricingModule, StoreModule } from '@apttus/ecommerce';
import { ApttusModule } from '@apttus/core';
import { BreadcrumbComponent } from './component/breadcrumb.component';
import { TabFeaturesComponent } from './component/tab-features.component';
import { TabAttachmentsComponent } from './component/tab-attachments.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProductReplacementsComponent } from './component/product-replacements.component';

import { ConstraintRulesModule } from '@apttus/constraint-rules';

@NgModule({
  imports: [
    CommonModule,
    ProductDetailsRoutingModule,
    NgxGalleryModule,
    ComponentModule,
    CartModule,
    CatalogModule,
    PricingModule,
    StoreModule,
    ApttusModule,
    ConstraintRulesModule,
    TabsModule.forRoot()
  ],
  providers : [],
  declarations: [ProductDetailsComponent,
                ProductImagesComponent,
                BreadcrumbComponent,
                TabFeaturesComponent,
                ProductReplacementsComponent,
                TabAttachmentsComponent]
})
export class ProductDetailsModule { }
