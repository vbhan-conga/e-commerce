import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Cart, ItemGroup, CartService, CartItemService, ConstraintRuleService, Product, LineItemService } from '@apttus/ecommerce';
import { Observable, combineLatest, of } from 'rxjs';
import { take, map, tap, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ManageCartResolver implements Resolve<any> {

  constructor(private cartService: CartService, private cartItemService: CartItemService, private crService: ConstraintRuleService) {}

  state(): Observable<ManageCartState> {
    return this.cartService.getMyCart()
      .pipe(
        mergeMap(cart => {
          return combineLatest(of(cart), this.crService.getRecommendationsForCart(cart));
        }),
        map(([cart, products]) => {
          return {
            cart: cart,
            lineItems: LineItemService.groupItems(_.get(cart, 'LineItems')),
            productList: products
          } as ManageCartState;
        })
      );
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.state().pipe(take(1));
  }

}
/** @ignore */
export interface ManageCartState {
  cart: Cart;
  lineItems: Array<ItemGroup>;
  productList: Array<Product>;
}