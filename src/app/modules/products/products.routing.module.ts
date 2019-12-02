/**
 * Apttus Digital Commerce
 *
 * Dedicated routing module for the product details module.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDetailComponent } from './detail/product-detail.component';
import { ProductListComponent } from './list/product-list.component';
import { ConfigureGuard } from '../../services/configure.guard';
import { ProductDetailsResolver } from './services/product-details.resolver';

const routes: Routes = [
    {
        path: '',
        component: ProductListComponent
    },
    {
        path: 'compare',
        loadChildren: () => import('../../modules/compare/compare.module').then(m => m.CompareModule),
        data: { title: 'Product Comparison' }
    },
    {
        path: ':id',
        component: ProductDetailComponent,
        resolve: { state: ProductDetailsResolver }
    },
    {
        path: 'category/:categoryName',
        component: ProductListComponent
    },
    {
        path: ':id/:cartItem',
        component: ProductDetailComponent,
        resolve: { state: ProductDetailsResolver },
        canDeactivate: [ConfigureGuard]
    }
];

/**
 * @internal
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
