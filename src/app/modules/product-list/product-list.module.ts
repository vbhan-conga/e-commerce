import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComponentModule } from '../../components/component.module';

import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './layout/product-list.component';

import { CatalogModule, StoreModule, PricingModule } from '@apttus/ecommerce';
import { ResultsComponent } from './component/results.component';

import { ConstraintRulesModule } from '@apttus/constraint-rules';
import { AboModule } from '@apttus/abo';
import { MdSpinnerModule, BreadcrumbModule, ProductCardModule, FilterModule, InputFieldModule, ButtonModule, InputSelectModule } from '@apttus/elements';


import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPageScrollModule } from 'ngx-page-scroll';

@NgModule({
  imports: [
    CommonModule,
    ProductListRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentModule,
    StoreModule,
    PricingModule,
    CatalogModule,
    NgxPageScrollModule,
    ConstraintRulesModule,
    AboModule,
    MdSpinnerModule,
    BreadcrumbModule,
    ProductCardModule,
    InputFieldModule,
    InputSelectModule,
    ButtonModule,
    FilterModule,
    PaginationModule.forRoot()
  ],
  declarations: [ProductListComponent, ResultsComponent]
})
export class ProductListModule { }
