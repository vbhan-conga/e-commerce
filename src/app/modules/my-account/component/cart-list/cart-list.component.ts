import { Component, OnInit, TemplateRef, NgZone } from '@angular/core';
import { ACondition } from '@apttus/core'
import { CartService, Cart, PriceService } from '@apttus/ecommerce';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

/**
 * Cart list Component loads and shows all the carts for logged in user.
 */
@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {

  /**
   * All carts for logged in user.
   */
  cartList: Array<Cart>;
  myCart: Cart;
  cart: Cart = new Cart();
  cartAggregate$: Observable<Array<any>>;
  modalRef: BsModalRef;
  message: string;
  loading: boolean = false;
  /**
   * Current page used by the pagination component. Default is 1.
   */
  currentPage: number = 1;
  /**
   * Number of records per page used by the pagination component. Default is 10.
   */
  limit: number = 10;

  /** 
   * @ignore
   */
  constructor(private cartService: CartService, public priceService: PriceService, private modalService: BsModalService, private ngZone: NgZone) { }

  /** 
   * @ignore
   */
  ngOnInit() {
    this.cartService.getMyCart().subscribe(c =>  this.myCart = c);
    this.loadCarts(this.currentPage);
    this.cartAggregate$ = this.cartService.aggregate([new ACondition(Cart, 'Id', 'NotNull', null)]);
  }

  /**
   * It loads all the cart of logged in user for given page number.
   * @param page Page number to load cart list.
   */
  loadCarts(page) {
    this.cartList = null;
    this.cartService.getMyCarts(this.limit, page).take(1).subscribe(c => this.ngZone.run(() => this.cartList = c));
  }

  /**
   * Creates new cart for logged in user based on input.
   * @param template Modal input for taking user inputs for new cart.
   */
  newCart(template: TemplateRef<any>){
    this.cart = new Cart();
    this.message = null;
    this.modalRef = this.modalService.show(template);
  }

  /**
   * Deletes given cart for logged in user.
   * @param cart Cart to delete.
   */
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

  /**
   * Sets given cart to active state.
   * @param cart Cart that needs to be Active.
   */
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

  /**
   * @ignore 
   */
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
