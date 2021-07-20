/**
 * Apttus Digital Commerce
 *
 * Dedicated routing module for the order history module
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderHistoryLayoutComponent } from './layout/order-history-layout.component';

const routes: Routes = [
  {
    path : '',
    component : OrderHistoryLayoutComponent
  }
];

/**
 * @internal
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderHistoryRoutingModule { }
