import { Component, OnInit, TemplateRef, NgZone } from '@angular/core';
import { ACondition } from '@apttus/core'
import { CartService, Cart, PriceService } from '@apttus/ecommerce';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {

  cartList: Array<Cart>;
  myCart: Cart;
  cart: Cart = new Cart();
  cartAggregate$: Observable<Array<any>>;
  modalRef: BsModalRef;
  message: string;
  loading: boolean = false;
  currentPage: number = 1;
  limit: number = 10;

  constructor(private cartService: CartService, public priceService: PriceService, private modalService: BsModalService, private ngZone: NgZone) { }

  ngOnInit() {
    this.cartService.getMyCart().subscribe(c =>  this.myCart = c);
    this.loadCarts(this.currentPage);
    this.cartAggregate$ = this.cartService.aggregate([new ACondition(Cart, 'Id', 'NotNull', null)]);
  }

  loadCarts(page) {
    this.cartList = null;
    this.cartService.getMyCarts(this.limit, page).take(1).subscribe(c => this.ngZone.run(() => this.cartList = c));
  }

  newCart(template: TemplateRef<any>){
    this.cart = new Cart();
    this.message = null;
    this.modalRef = this.modalService.show(template);
  }

  deleteCart(cart: Cart){
    cart._metadata = { state: 'processing' };
    this.cartService.deleteCart(cart).subscribe(
      res => {
        this.cartService.refreshCart(cart.Id);
        this.loading = false;
        this.loadCarts(this.currentPage);
      },
      err => this.loading = false
    );
  }

  setCartActive(cart: Cart){
    _.set(cart, '_metadata.state', 'processing');
    this.cartService.setCartActive(cart).subscribe(
      res => {
        _.set(cart, '_metadata.state', 'ready');
      },
      err => {
        _.set(cart, '_metadata.state', 'ready');
      }
    );
  }

  createCart(){
    this.loading = true;
    this.currentPage = 1;
    this.cartService.createNewCart(this.cart).subscribe(
      res => {
        this.loading = false;
        this.modalRef.hide();
        this.loadCarts(this.currentPage);
      },
      err => {
        this.loading = false;
        this.message = 'Could not create cart. Please contact your administrator.';
      }
    );
  }

}
