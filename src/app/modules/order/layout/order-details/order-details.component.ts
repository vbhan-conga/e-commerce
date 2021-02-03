import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter, flatMap, map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import { get, sum, cloneDeep, set, uniq, compact, find } from 'lodash';
import { ACondition, ApiService } from '@apttus/core';
import {
  Order,
  OrderLineItem,
  UserService,
  ItemGroup,
  LineItemService,
  OrderLineItemService,
  Account,
  Quote
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
   * String containing the lookup fields to be queried for an order record.
   */
  private orderLookups = `PriceListId,PrimaryContact,Owner,CreatedBy`;

  /**
   * String containing the lookup fields to be queried for a proposal record.
   */
  private proposalLookups = `PriceListId,Primary_Contact,BillToAccountId,ShipToAccountId,AccountId,OpportunityId,Owner`;

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
              private userService: UserService,
              private apiService: ApiService,
              private orderLineItemService: OrderLineItemService,
              private ngZone: NgZone) { }

  ngOnInit() {
    const order$ = this.activatedRoute.params
      .pipe(
        filter(params => get(params, 'id') != null),
        map(params => get(params, 'id')),
        flatMap(orderId => this.apiService.get(`/orders/${orderId}?lookups=${this.orderLookups}`, Order)),
        switchMap((order: Order) => combineLatest([of(order), 
          get(order, 'ProposalId') ? this.apiService.get(`/quotes/${order.ProposalId}?lookups=${this.proposalLookups}`, Quote) : of(null),
          this.apiService.get(`/accounts?condition[0]=Id,In,${compact(uniq([order.BillToAccountId, order.ShipToAccountId, order.SoldToAccountId, get(order, 'PrimaryContact.AccountId')]))}&lookups=OwnerId,PriceListId`, Account)])
        ),
        map(([order, quote, account]) => {
          order.Proposal = quote;
          order.SoldToAccount = find(account, acc => acc.Id === order.SoldToAccountId);
          order.BillToAccount = find(account, acc => acc.Id === order.BillToAccountId);
          order.ShipToAccount = find(account, acc => acc.Id === order.ShipToAccountId);
          set(order, 'PrimaryContact.Account', find(account, acc => order.PrimaryContact && acc.Id === order.PrimaryContact.AccountId));
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
