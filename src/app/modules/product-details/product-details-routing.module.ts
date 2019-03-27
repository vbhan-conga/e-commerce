import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProductDetailsComponent} from './layout/product-details.component';
import { ConfigureGuard } from '../../services/configure.guard';

const routes: Routes = [
    {
        path: ':productCode',
        component: ProductDetailsComponent
    },
    {
        path: ':productCode/:cartItemId',
        component: ProductDetailsComponent,
        canDeactivate: [ConfigureGuard]
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductDetailsRoutingModule { }
