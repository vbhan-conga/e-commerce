import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentMesageComponent } from './layout/payment-message.component';

const routes: Routes = [
  {
    path : '',
    component : PaymentMesageComponent
  }
];

/**
 * @internal
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentMessageRoutingModule { }
