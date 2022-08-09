/**
 * Apttus Digital Commerce
 *
 * Dedicated routing module for the order module.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailComponent } from './layout/order-details/order-detail.component';
import { DetailsGuard } from '@congacommerce/ecommerce';

const routes: Routes = [
  {
    path: ':id',
    component: OrderDetailComponent,
    canActivate: [DetailsGuard]
  },
  {
    path: '',
    redirectTo: '/my-account/orders',
    pathMatch: 'full'
  }
];

/**
 * @internal
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
