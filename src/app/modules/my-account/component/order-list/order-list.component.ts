import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';
import { ACondition } from '@apttus/core';

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
  orderAggregate$: Observable<Array<any>>;

  /**
   * @ignore 
   */
  constructor(private orderService: OrderService) {}

  /**
   * @ignore 
   */
  ngOnInit() {
    this.loadOrders(this.currentPage);
    this.orderAggregate$ = this.orderService.aggregate([new ACondition(Order, 'Id', 'NotNull', null)]);
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

