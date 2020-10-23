import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, flatMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { get, first, sum } from 'lodash';
import { ACondition, ApiService } from '@apttus/core';
import {
  Order,
  OrderLineItem,
  OrderService,
  UserService,
  QuoteService,
  ItemGroup,
  LineItemService,
  OrderLineItemService
} from '@apttus/ecommerce';

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

  /**
   * Orderlineitems observable.
   */
  orderLineItems$: Observable<Array<ItemGroup>>;

  constructor(private activatedRoute: ActivatedRoute,
              private orderService: OrderService,
              private router: Router, private userService: UserService,
              private quoteService: QuoteService,
              private apiService: ApiService,
              private orderLineItemService: OrderLineItemService) { }

  ngOnInit() {
    this.order$ = this.activatedRoute.params
      .pipe(
        filter(params => get(params, 'id') != null),
        map(params => get(params, 'id')),
        flatMap(orderId => this.apiService.get(`/orders?condition[0]=Id,Equal,${orderId}&lookups=PriceListId,PrimaryContact,BillToAccountId,ShipToAccountId,SoldToAccountId,Owner,CreatedBy`, Order)),
        map(first),
        switchMap((order: Order) => combineLatest(of(order), get(order, 'Proposal.Id') ? this.quoteService.get([order.Proposal.Id]) : of(null))),
        map(([order, quote]) => {
          order.Proposal = first(quote);
          return order;
        })
      );

    this.orderLineItems$ = this.activatedRoute.params
      .pipe(
        filter(params => get(params, 'id') != null),
        map(params => get(params, 'id')),
        mergeMap(orderId => this.orderLineItemService.query({
          conditions: [new ACondition(this.orderLineItemService.type, 'OrderId', 'In', [orderId])],
          waitForExpansion: false
        })),
        map(result => LineItemService.groupItems(result))
      );

    this.isLoggedIn$ = this.userService.isLoggedIn();
  }

  getTotalPromotions(orderLineItems: Array<OrderLineItem> = []): number {
    return orderLineItems.length ? sum(orderLineItems.map(res => res.IncentiveAdjustmentAmount)) : 0;
  }

  getChildItems(orderLineItems: Array<OrderLineItem>, lineItem: OrderLineItem): Array<OrderLineItem> {
    return orderLineItems.filter(orderItem => !orderItem.IsPrimaryLine && orderItem.PrimaryLineNumber === lineItem.PrimaryLineNumber);
  }
}
