import { NgModule } from '@angular/core';
import { InstalledProductsRoutingModule } from './installed-products-routing.module';
import { InstalledProductsLayoutComponent } from './layout/installed-products-layout.component';
import { AccordionModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';
import { PricingModule } from '@apttus/ecommerce';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RenewalFilterComponent } from './components/renewal-filter.component';
import { ApttusModule } from '@apttus/core';
import { PriceTypeFilterComponent } from './components/price-type-filter.component';
import { AssetListModule, FilterModule, InputSelectModule } from '@apttus/elements';
import { ButtonModule } from '@apttus/elements';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ApttusModule,
    PricingModule,
    FilterModule,
    AssetListModule,
    InputSelectModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    InstalledProductsRoutingModule,
    AccordionModule.forRoot(),
    ButtonModule
  ],
  declarations: [
    InstalledProductsLayoutComponent,
    RenewalFilterComponent,
    PriceTypeFilterComponent
  ]
})
export class InstalledProductsModule {

}
