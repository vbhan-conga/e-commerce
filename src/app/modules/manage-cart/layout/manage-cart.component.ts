import { Component, OnInit } from '@angular/core';
import { Cart, CartService, ProductService, Product } from '@apttus/ecommerce';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-manage-cart',
  templateUrl: './manage-cart.component.html',
  styleUrls: ['./manage-cart.component.scss']
})
/**
 * Manage Cart component is used to show the list of cart line item(s)  and summary of the cart.
 */
export class ManageCartComponent implements OnInit {
  /**
   * Observable of cart
   */
  cart$: Observable<Cart>;
    /**
   * Observable of Array of Product
   */
  productList$: Observable<Array<Product>>;

  constructor(private cartService: CartService, private productService: ProductService) { }

  ngOnInit() {
    this.cart$ = this.cartService.getMyCart();
    this.productList$ = this.cart$
      .take(1)
      .flatMap(cart => this.productService.get([_.get(_.get(cart, 'LineItems')[Math.floor(Math.random() * _.get(cart, 'LineItems.length', 0))], 'Product.Id', '')])
      .map(productList => productList[0])
      .flatMap(product => this.productService.getProductsByCategory(_.get(product, 'Categories[0].ClassificationId'), 10))
    );
  }

}
