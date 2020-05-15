import { Component, OnInit } from '@angular/core';
import { OrderService, Order, UserService, User } from '@apttus/ecommerce';
import { ACondition, AFilter } from '@apttus/core';
import { Observable, combineLatest } from 'rxjs';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { TableOptions } from '@apttus/elements';

/**
 * This component is for Apttus-ecommerce dashboard. This gives you glimpse of orders, quotes and total spending done for logged in user profile.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  type = Order;
  view$: Observable<DashboardView>;
  colorPalette = ['#D22233', '#F2A515', '#6610f2', '#008000', '#17a2b8', '#0079CC', '#CD853F', '#6f42c1', '#20c997', '#fd7e14'];

  tableOptions: TableOptions = {
    columns: [
      {
        prop: 'Name'
      },
      {
        prop: 'OrderAmount'
      },
      {
        prop: 'CreatedDate'
      }
    ],
    filters: [new AFilter(Order, [new ACondition(Order, 'CreatedDate', 'LastXDays', 7)])]
  };

  /**
  * @ignore
  */
  constructor(private orderService: OrderService, private userService: UserService) {}

  /**
  * @ignore
  */
  ngOnInit() {
    this.view$ = combineLatest(
      this.userService.me(),
      this.orderService.query({
        aggregate: true,
        conditions: [new ACondition(Order, 'CreatedDate', 'LastXDays', 7)],
        groupBy: ['Status']
      }),
      this.orderService.query({
        aggregate: true
      }).pipe(map(res => _.first(res)))
    ).pipe(
      map(([user, recentOrders, agg]) => {
        return {
          user: user,
          tableOptions: this.tableOptions,
          recentOrders: _.isArray(recentOrders)
          ? _.sumBy(recentOrders, order => _.get(order, 'total_records'))
          : _.get(recentOrders, 'total_records'),
          totalAmount: _.get(agg, 'SUM_OrderAmount'),
          orderAmountByStatus: _.isArray(recentOrders)
            ? _.omit(_.mapValues(_.groupBy(recentOrders, 'Apttus_Config2__Status__c'), s => _.sumBy(s, 'SUM_OrderAmount')), 'null')
            : _.zipObject([_.get(recentOrders, 'Apttus_Config2__Status__c')], _.map([_.get(recentOrders, 'Apttus_Config2__Status__c')], key => _.get(recentOrders, 'SUM_OrderAmount')))
        } as DashboardView;
      })
    );
  }
}

/** @ignore */
interface DashboardView {
  user: User;
  tableOptions: TableOptions;
  recentOrders: number;
  totalAmount: number;
  orderAmountByStatus: object;
}
