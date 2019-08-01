import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComponentModule } from '../../components/component.module';

import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './layout/product-list.component';

import { PricingModule } from '@apttus/ecommerce';
import { ResultsComponent } from './component/results.component';
import { IconModule, BreadcrumbModule, ProductCardModule, FilterModule, InputFieldModule, ButtonModule, InputSelectModule } from '@apttus/elements';


import { PaginationModule } from 'ngx-bootstrap/pagination';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ProductListRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentModule,
    PricingModule,
    IconModule,
    BreadcrumbModule,
    ProductCardModule,
    InputFieldModule,
    InputSelectModule,
    ButtonModule,
    FilterModule,
    PaginationModule.forRoot(),
    TranslateModule.forChild()
  ],
  declarations: [ProductListComponent, ResultsComponent]
})
export class ProductListModule { }
