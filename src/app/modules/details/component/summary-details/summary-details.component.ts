import { Component, OnInit, Input } from '@angular/core';
import { Contact, Order, Account, User } from '@apttus/ecommerce';
import * as _ from 'lodash';

/**
 * Component for rendering header section while viewing quotes/orders.
 */
@Component({
  selector: 'app-summary-details',
  templateUrl: './summary-details.component.html',
  styleUrls: ['./summary-details.component.scss']
})
export class SummaryDetailsComponent implements OnInit {

  /**
   * Give order line items OR quote lineitems for rendering header section.
   */
  @Input() item: Order;
  
  constructor() { }

  ngOnInit() {}
}