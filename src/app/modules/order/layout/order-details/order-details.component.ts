import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, flatMap, map, switchMap } from 'rxjs/operators';
import { get, first, sum } from 'lodash';
import { ACondition } from '@apttus/core';
import { Order, OrderLineItem, OrderService, UserService, QuoteService, ItemGroup, LineItemService } from '@apttus/ecommerce';

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

  /**
    * Boolean observable to check if user is logged in.
    */
  isLoggedIn$: Observable<boolean>;
  /** @ignore */
  orderLineItems$: Observable<Array<ItemGroup>>;

  constructor(private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private router: Router, private userService: UserService,
    private quoteService: QuoteService, private lineItemService: LineItemService) { }

  ngOnInit() {
    this.order$ = this.activatedRoute.params
      .pipe(
        filter(params => get(params, 'id') != null),
        flatMap(params => this.orderService.query({
          conditions: [new ACondition(this.orderService.type, 'Id', 'In', [get(params, 'id')])],
          waitForExpansion: false
        })),
        map(first),
        switchMap((order: Order) => combineLatest(of(order), get(order,'Proposal.Id') ? this.quoteService.get([order.Proposal.Id]) : of(null))),
        map(([order, quote]) => {
          order.Proposal = first(quote);
          this.orderLineItems$ = of(LineItemService.groupItems(order.OrderLineItems));
          return order;
        })
      );
    this.isLoggedIn$ = this.userService.isLoggedIn();
  }

  /**
   * @ignore
   */
  getTotalPromotions(order: Order): number {
    return ((get(order, 'OrderLineItems.length') > 0)) ? sum(get(order, 'OrderLineItems').map(res => res.IncentiveAdjustmentAmount)) : 0;
  }

  /**
   * @ignore
   */
  getChildItems(orderLineItems: Array<OrderLineItem>, lineItem: OrderLineItem): Array<OrderLineItem> {
    return orderLineItems.filter(orderItem => !orderItem.IsPrimaryLine && orderItem.PrimaryLineNumber === lineItem.PrimaryLineNumber);
  }

}
