/**
 * Apttus Digital Commerce
 *
 * Dedicated routing module for the installed products module
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstalledProductsLayoutComponent } from './layout/installed-products-layout.component';

const routes: Routes = [
  {
    path: '',
    component: InstalledProductsLayoutComponent
  },
  {
    path: ':operation/:productId',
    component: InstalledProductsLayoutComponent
  }
];

/**
 * @internal
 */
@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class InstalledProductsRoutingModule {}
