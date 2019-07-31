import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-message',
  templateUrl: './payment-message.component.html'
})
export class PaymentMesageComponent implements OnInit {

  constructor() {}

   ngOnInit(){
    window.parent.window.postMessage({'payment':'true'}, `https://${window.location.hostname}`);
   }
}
