import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentMessageRoutingModule } from './payment-message-routing.module';
import { PaymentMesageComponent } from './layout/payment-message.component';

@NgModule({
  imports: [
    CommonModule,
    PaymentMessageRoutingModule
  ],
  declarations: [PaymentMesageComponent]
})
export class PaymentMessageModule { }
