import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-message',
  template: ``
})
export class PaymentMesageComponent implements OnInit {

  constructor() {}

   ngOnInit(){
    window.parent.window.postMessage({'payment':'true'}, `${window.location.href}`);
   }
}
