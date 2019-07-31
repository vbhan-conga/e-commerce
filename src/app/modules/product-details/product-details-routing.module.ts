/**
 * Apttus Digital Commerce
 *
 * Dedicated routing module for the product details module.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProductDetailsComponent} from './layout/product-details.component';
import { ConfigureGuard } from '../../services/configure.guard';
import { ProductDetailsResolver } from './services/product-details.resolver';

const routes: Routes = [
    {
        path: ':productCode',
        component: ProductDetailsComponent,
        resolve : {state : ProductDetailsResolver}
    },
    {
        path: ':productCode/:cartItemId',
        component: ProductDetailsComponent,
        canDeactivate: [ConfigureGuard],
        resolve: { state: ProductDetailsResolver }
    }
];

/**
 * @internal
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductDetailsRoutingModule { }
