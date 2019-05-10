import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Order } from '@apttus/ecommerce';
import * as _ from 'lodash';

/**
 * Price Summary component displays the total price and applied promotions on order item.
 */
@Component({
  selector: 'app-price-summary',
  templateUrl: './price-summary.component.html',
  styleUrls: ['./price-summary.component.scss']
})
export class PriceSummaryComponent implements OnChanges {

  /**
   * Instance of Order item.
   */
  @Input() item: Order;

  /**
   * Total promotion amount applied to the order.
   */
  totalPromotions: number = 0;

  constructor() { }

  /**
   * @ignore
   */
  ngOnChanges(){
    if(this.item instanceof Order)
      this.totalPromotions = ((this.item && _.get(this.item,'OrderLineItems.length') > 0)) ?_.sum(_.get(this.item,'OrderLineItems').map(res => res.IncentiveAdjustmentAmount)):0;
  }

}