import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '@apttus/ecommerce';
import { Operator, AFilter } from '@apttus/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { TableOptions, FilterOptions } from '@apttus/elements';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

/**
 * Displays all orders for the logged in user in grid view with pagination.
 */
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  type = Order;
  view$: Observable<OrderListView>;
  colorPalette = ['#D22233', '#F2A515', '#6610f2', '#008000', '#17a2b8', '#0079CC', '#CD853F', '#6f42c1', '#20c997', '#fd7e14'];
  tableOptions: TableOptions = {
    columns: [
      {
        prop: 'Name'
      },
      {
        prop: 'Description',
        label: 'Title'
      },
      {
        prop: 'Status'
      },
      {
        prop: 'PriceListId'
      },
      {
        prop: 'BillToAccountId'
      },
      {
        prop: 'ShipToAccountId'
      },
      {
        prop: 'OrderAmount'
      },
      {
        prop: 'CreatedDate'
      },
      {
        prop: 'ActivatedDate'
      }
    ]
  };

  filterList: Array<AFilter> = [];

  filterOptions: FilterOptions = {
    visibleFields: [
      'BillToAccountId',
      'Status',
      'OrderAmount',
      'CreatedDate'
    ],
    visibleOperators: [
      Operator.EQUAL,
      Operator.LESS_THAN,
      Operator.GREATER_THAN,
      Operator.GREATER_EQUAL,
      Operator.LESS_EQUAL,
      Operator.IN
    ]
  };
  /**
   * @ignore
   */
  constructor(private orderService: OrderService, private translateService: TranslateService) {}

  /**
   * @ignore
   */
  ngOnInit() {
    this.loadViewData();
  }

  loadViewData() {
    this.view$ = this.orderService.query({
      aggregate: true,
      groupBy: ['Status'],
      filters: this.filterList
    }).pipe(
      map(data => {
        return {
          tableOptions: _.clone(_.assign(this.tableOptions, {filters: this.filterList})),
          total: _.get(data, 'total_records', _.sumBy(data, 'total_records')),
          totalAmount: _.get(data, 'SUM_OrderAmount', _.sumBy(data, 'SUM_OrderAmount')),
          ordersByStatus: _.isArray(data)
            ? _.omit(_.mapValues(_.groupBy(data, 'Apttus_Config2__Status__c'), s => _.sumBy(s, 'total_records')), 'null')
            : _.zipObject([_.get(data, 'Apttus_Config2__Status__c')], _.map([_.get(data, 'Apttus_Config2__Status__c')], key => _.get(data, 'total_records'))),
          orderAmountByStatus: _.isArray(data)
            ? _.omit(_.mapValues(_.groupBy(data, 'Apttus_Config2__Status__c'), s => _.sumBy(s, 'SUM_OrderAmount')), 'null')
            : _.zipObject([_.get(data, 'Apttus_Config2__Status__c')], _.map([_.get(data, 'Apttus_Config2__Status__c')], key => _.get(data, 'SUM_OrderAmount')))
        } as OrderListView;
      })
    );
  }

  handleFilterListChange(event: any) {
    this.filterList = event;
    this.loadViewData();
  }

}

/** @ignore */
interface OrderListView{
  tableOptions: TableOptions;
  total: number;
  totalAmount: number;
  ordersByStatus: object;
  orderAmountByStatus: object;
}