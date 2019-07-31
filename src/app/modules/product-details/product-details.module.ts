import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComponentModule } from '../../components/component.module';
import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { ProductDetailsComponent } from './layout/product-details.component';

import { NgxGalleryModule } from 'ngx-gallery';

import { PricingModule} from '@apttus/ecommerce';
import { ApttusModule } from '@apttus/core';

import { TabFeaturesComponent } from './component/tab-features.component';
import { TabAttachmentsComponent } from './component/tab-attachments.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProductReplacementsComponent } from './component/product-replacements.component';


import { ConfigureGuard } from '../../services/configure.guard';
import { BreadcrumbModule, ButtonModule, PriceModule, ProductCarouselModule, ProductConfigurationModule, IconModule, InputDateModule, ProductImagesModule, ProductConfigurationSummaryModule } from '@apttus/elements';
import { TranslateModule } from '@ngx-translate/core'; 
import { DetailsModule } from '../details/details.module';

@NgModule({
  imports: [
    CommonModule,
    BreadcrumbModule,
    ProductCarouselModule,
    ProductConfigurationModule,
    ProductConfigurationSummaryModule,
    IconModule,
    ButtonModule,
    ProductImagesModule,
    PriceModule,
    FormsModule,
    ProductDetailsRoutingModule,
    NgxGalleryModule,
    ComponentModule,
    PricingModule,
    ApttusModule,
    TabsModule.forRoot(),
    InputDateModule,
    TranslateModule.forChild(),
    DetailsModule
  ],
  providers : [ConfigureGuard],
  declarations: [ProductDetailsComponent,
                TabFeaturesComponent,
                ProductReplacementsComponent,
                TabAttachmentsComponent]
})
export class ProductDetailsModule { }
