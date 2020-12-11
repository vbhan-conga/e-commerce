import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter, flatMap, map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import { get, first, sum, cloneDeep } from 'lodash';
import { ACondition, ApiService } from '@apttus/core';
import {
  Order,
  OrderLineItem,
  OrderService,
  UserService,
  QuoteService,
  ItemGroup,
  LineItemService,
  OrderLineItemService,
  Account
} from '@apttus/ecommerce';

/**
 * Order details component is a way to show the details of an order.
 */
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {

  /**
   * Observable instance of an Order.
   */
  order$: BehaviorSubject<Order> = new BehaviorSubject<Order>(null);

  /**
   * Boolean observable to check if user is logged in.
   */
  isLoggedIn$: Observable<boolean>;

  /**
   * Orderlineitems observable.
   */
  orderLineItems$: BehaviorSubject<Array<ItemGroup>> = new BehaviorSubject<Array<ItemGroup>>(null);

  orderSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private orderService: OrderService,
              private router: Router,
              private userService: UserService,
              private quoteService: QuoteService,
              private lineItemService: LineItemService,
              private apiService: ApiService,
              private orderLineItemService: OrderLineItemService,
              private ngZone: NgZone) { }

  ngOnInit() {
    const order$ = this.activatedRoute.params
      .pipe(
        filter(params => get(params, 'id') != null),
        map(params => get(params, 'id')),
        flatMap(orderId => this.apiService.get(`/orders?condition[0]=Id,Equal,${orderId}&lookups=PriceListId,PrimaryContact,BillToAccountId,ShipToAccountId,SoldToAccountId,Owner,CreatedBy`, Order)),
        map(first),
        switchMap((order: Order) => combineLatest([of(order),
          get(order, 'Proposal.Id') ? this.quoteService.get([order.Proposal.Id]) : of(null),
          get(order, 'PrimaryContact.AccountId') ? this.apiService.get(`/accounts?condition[0]=Id,Equal,${order.PrimaryContact.AccountId}`, Account) : of(null)])
        ),
        map(([order, quote]) => {
          order.Proposal = first(quote);
          return order;
        })
      );

    const orderLineItems$ = this.activatedRoute.params
      .pipe(
        filter(params => get(params, 'id') != null),
        map(params => get(params, 'id')),
        mergeMap(orderId => this.orderLineItemService.query({
          conditions: [new ACondition(this.orderLineItemService.type, 'OrderId', 'In', [orderId])],
          waitForExpansion: false
        }))
      );

    this.orderSubscription = combineLatest(order$.pipe(startWith(null)), orderLineItems$.pipe(startWith(null)))
      .pipe(map(([order, lineItems]) => {
        if (!order) return;
        order.OrderLineItems = lineItems;
        this.orderLineItems$.next(LineItemService.groupItems(lineItems));
        this.ngZone.run(() => this.order$.next(cloneDeep(order)));
      })).subscribe();

    this.isLoggedIn$ = this.userService.isLoggedIn();
  }

  getTotalPromotions(orderLineItems: Array<OrderLineItem> = []): number {
    return orderLineItems.length ? sum(orderLineItems.map(res => res.IncentiveAdjustmentAmount)) : 0;
  }

  getChildItems(orderLineItems: Array<OrderLineItem>, lineItem: OrderLineItem): Array<OrderLineItem> {
    return orderLineItems.filter(orderItem => !orderItem.IsPrimaryLine && orderItem.PrimaryLineNumber === lineItem.PrimaryLineNumber);
  }

  ngOnDestroy() {
    this.orderSubscription && this.orderSubscription.unsubscribe();
  }
}
