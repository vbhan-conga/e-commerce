import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Cart, CartService, Product, ConstraintRuleService, CartItemService, ItemGroup } from '@apttus/ecommerce';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { map, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-manage-cart',
  templateUrl: './manage-cart.component.html',
  styleUrls: ['./manage-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * Manage Cart component is used to show the list of cart line item(s)  and summary of the cart.
 */
export class ManageCartComponent implements OnInit {
  @ViewChild('discardChangesTemplate') discardChangesTemplate: TemplateRef<any>;


  discardChangesModal: BsModalRef;

  /**
   * Observable of cart
   */
  view$: Observable<View>;
    /**
   * Observable of Array of Product
   */
  productList$: Observable<Array<Product>>;

  constructor(private cartService: CartService, private cartItemService: CartItemService, private crService: ConstraintRuleService) { }

  ngOnInit() {

    this.view$ = this.cartService.getMyCart()
      .pipe(
        map(cart => {
          return {
            cart: cart,
            lineItems: this.cartItemService.groupItems(_.get(cart, 'LineItems'))
          } as View;
        })
      );

    this.productList$ = this.cartService.getMyCart()
      .pipe(
        mergeMap(cart => this.crService.getRecommendationsForCart(cart))
      );
  }

  trackById(index, record): string {
    return _.get(record, 'MainLine.Id');
  }
}

export interface View{
  cart: Cart;
  lineItems: Array<ItemGroup>;
}
