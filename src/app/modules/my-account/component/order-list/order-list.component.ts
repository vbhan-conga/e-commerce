import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';
import { ACondition } from '@apttus/core';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  currentPage: number = 1;
  limit: number = 10;

  orderList: Array<Order>;
  orderAggregate$: Observable<Array<any>>;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders(this.currentPage);
    this.orderAggregate$ = this.orderService.aggregate([new ACondition(Order, 'Id', 'NotNull', null)]);
  }

  loadOrders(page) {
    this.orderList = null;
    this.orderService.getMyOrders(null, null, this.limit, page).subscribe((res: Array<Order>) => this.orderList = res);
  }

}

