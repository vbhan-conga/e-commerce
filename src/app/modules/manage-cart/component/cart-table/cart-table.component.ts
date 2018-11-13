import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, TemplateRef } from '@angular/core';
import { Cart, CartItem, CartService } from '@apttus/ecommerce';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-cart-table',
  templateUrl: './cart-table.component.html',
  styleUrls: ['./cart-table.component.scss']
})
export class CartTableComponent implements OnInit {
  @Input() cart: Cart;

  /**
   * Debounce time in milliseconds for change item quantity calculation.
   *
   * @ignore
   */
  private QUANTITY_CHANGE_DEBOUNCE_TIME = 2000;

  /**
   * Current timeout id for the change item quantity timer.
   *
   * @ignore
   */
  private timeoutId: any;
  modalRef: BsModalRef;
  lineItem: CartItem;

  constructor(private cartService: CartService, private modalService: BsModalService) { }

  ngOnInit() {
  }

  /**
   * Removes the provided CartItem from the user's current active cart.
   *
   * @param item CartItem instance to remove from cart.
   * @param evt Event associated with the user action.
   * @fires CartService.removeCartItem()
   */
  removeCartItem(item: CartItem, evt) {
    item._metadata = { _deleting: true };
    evt.stopPropagation();
    this.cartService.removeCartItem(item)
      .subscribe(
        () => item._metadata = { _deleting: false },
        () => item._metadata = { _deleting: false }
      );
  }
  /**
   * Changes the quantity of the cart item passed to this method.
   *
   * @param cartItem Cart item reference to change quantity.
   * @param event The event object
   * @fires CartService.updateQuantity()
   */
  changeItemQuantity(cartItem: CartItem) {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.cartService.updateQuantity([cartItem]).take(1).subscribe();
    }, this.QUANTITY_CHANGE_DEBOUNCE_TIME);
  }

  openModal(lineItem: CartItem, template: TemplateRef<any>) {
    this.lineItem = lineItem;
    this.modalRef = this.modalService.show(template);
  }
}
