import { Component, OnInit, ChangeDetectionStrategy, Input, TemplateRef } from '@angular/core';
import { Cart, CartItem, CartService, PriceListItemService } from '@apttus/ecommerce';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-cart-table',
  templateUrl: './cart-table.component.html',
  styleUrls: ['./cart-table.component.scss']
})

export class CartTableComponent implements OnInit {
  @Input() cart: Cart;

  /**
   * Current timeout id for the change item quantity timer.
   *
   * @ignore
   */
  private timeoutId: any;
  modalRef: BsModalRef;
  lineItem: CartItem;
  public bsConfig: Partial<BsDatepickerConfig>;

  constructor(private cartService: CartService, private modalService: BsModalService, private pliService: PriceListItemService) {
    this.bsConfig = Object.assign({},
      {
        showWeekNumbers: false
      });
   }

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
    this.cartService.removeCartItem(item);
  }
  /**
   * Changes the quantity of the cart item passed to this method.
   *
   * @param cartItem Cart item reference to change quantity.
   * @param event The event object
   * @fires CartService.updateQuantity()
   */
  changeItemQuantity(cartItem: CartItem) {
    this.cartService.updateQuantity([cartItem]).take(1).subscribe();
  }

  openModal(lineItem: CartItem, template: TemplateRef<any>) {
    this.lineItem = lineItem;
    this.modalRef = this.modalService.show(template);
  }

  changePliDate(cartItem: CartItem){
    this.pliService.update([cartItem.PriceListItem]);
  }

  handleStartChange(cartItem: CartItem) {
    this.cartService.updateQuantity([cartItem]);
  }

  handleEndDateChange(cartItem: CartItem) {
    this.cartService.updateQuantity([cartItem]);
  }
}
