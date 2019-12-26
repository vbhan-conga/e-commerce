import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { ACondition } from '@apttus/core';
import { Order, OrderLineItem, OrderService, UserService, ItemGroup, LineItemService } from '@apttus/ecommerce';

/**
 * Order details component is a way to show the details of an order.
 */
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  /**
   * Observable instance of an Order.
   */
  order$: Observable<Order>;
  orderLineItems$: Observable<Array<ItemGroup>>;

  /**
    * Boolean observable to check if user is logged in.
    */
  isLoggedIn$: Observable<boolean>;

  constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService,
    private router: Router, private userService: UserService, private lineItemService: LineItemService) { }

  ngOnInit() {
    this.order$ = this.activatedRoute.params
      .pipe(
        filter(params => _.get(params, 'id') != null),
        flatMap(params => this.orderService.query({
          conditions: [new ACondition(this.orderService.type, 'Id', 'In', [_.get(params, 'id')])],
          waitForExpansion: false
          })),
        map(orderList => _.get(orderList, '[0]'))
      );
    this.isLoggedIn$ = this.userService.isLoggedIn();
    this.orderLineItems$ = this.order$.pipe(
      map(order => LineItemService.groupItems(order.OrderLineItems))
    );
  }

  /**
   * @ignore
   */
  getTotalPromotions(order: Order): number{
    return ((_.get(order,'OrderLineItems.length') > 0)) ?_.sum(_.get(order,'OrderLineItems').map(res => res.IncentiveAdjustmentAmount)):0;
  }

  /**
   * @ignore
   */
  getChildItems(orderLineItems: Array<OrderLineItem>, lineItem: OrderLineItem): Array<OrderLineItem>{
    return orderLineItems.filter(orderItem => !orderItem.IsPrimaryLine && orderItem.PrimaryLineNumber === lineItem.PrimaryLineNumber);
  }

}
