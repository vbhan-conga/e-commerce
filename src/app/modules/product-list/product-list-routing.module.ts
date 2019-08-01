/**
 * Apttus Digital Commerce
 *
 * Dedicated routing module for the product list module.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './layout/product-list.component';
const routes: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path : ':categoryName',
    component : ProductListComponent
  }
];

/**
 * @internal
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductListRoutingModule { }
