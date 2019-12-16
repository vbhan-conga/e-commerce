import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '@apttus/ecommerce';
import { ACondition } from '@apttus/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

/**
 * Displays all orders for the logged in user in grid view with pagination.
 */
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  /**
   * The current page used by the pagination component.
   */
  currentPage: number = 1;
  /**
   * Number of records per page used by the pagination component.
   */
  limit: number = 10;

  /**
   * List of orders for current page is stored here.
   */
  orderList: Array<Order>;
  order: Order = new Order();
  orderAggregate: any;
  /**
   * Control over button's text/label of pagination component for Multi-Language Support
   */
  paginationButtonLabels: any = {
    first: '',
    previous: '',
    next: '',
    last: ''
  };

  /**
   * @ignore 
   */
  constructor(private orderService: OrderService, private translateService: TranslateService) {}

  /**
   * @ignore 
   */
  ngOnInit() {
    this.loadOrders(this.currentPage);
    this.orderService.aggregate([new ACondition(Order, 'Id', 'NotNull', null)]).pipe(take(1)).subscribe(res => this.orderAggregate = res);
    this.translateService.stream('PAGINATION').subscribe((val: string) => {
      this.paginationButtonLabels.first = val['FIRST'];
      this.paginationButtonLabels.previous = val['PREVIOUS'];
      this.paginationButtonLabels.next = val['NEXT'];
      this.paginationButtonLabels.last = val['LAST'];
    });
  }

  /**
   * Lods all orders for current page number for logged-in user.
   * @param page Current page number needed by pagination component.
   */
  loadOrders(page) {
    this.orderList = null;
    this.orderService.getMyOrders(null, null, this.limit, page).subscribe((res: Array<Order>) => this.orderList = res);
  }
}