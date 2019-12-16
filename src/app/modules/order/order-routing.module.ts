/**
 * Apttus Digital Commerce
 *
 * Dedicated routing module for the order module.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailsComponent } from './layout/order-details/order-details.component';
import { OrderListComponent } from '../my-account/component/order-list/order-list.component';

const routes: Routes = [
  {
    path: ':id',
    component: OrderDetailsComponent
  },
  {
    path: '',
    redirectTo: '/orders',
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
