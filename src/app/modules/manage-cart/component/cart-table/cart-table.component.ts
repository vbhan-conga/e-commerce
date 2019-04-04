import { Component, OnChanges, Input, TemplateRef, OnInit } from '@angular/core';
import { Cart, CartItem, CartService, PriceListItemService, Storefront, StorefrontService } from '@apttus/ecommerce';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-table',
  templateUrl: './cart-table.component.html',
  styleUrls: ['./cart-table.component.scss']
})

export class CartTableComponent implements OnChanges, OnInit {
  @Input() cart: Cart;

  /**
   * Current timeout id for the change item quantity timer.
   *
   * @ignore
   */
  private timeoutId: any;
  modalRef: BsModalRef;
  lineItem: CartItem;
  identifier: string = this.cartService.configurationService.get('productIdentifier');
  public bsConfig: Partial<BsDatepickerConfig>;
  storefront$: Observable<Storefront>;

  constructor(private cartService: CartService, private modalService: BsModalService, private pliService: PriceListItemService, private route: Router, private storefrontService: StorefrontService) {
    this.identifier = cartService.configurationService.get('productIdentifier');
    this.bsConfig = Object.assign({},
      {
        showWeekNumbers: false
      });
   }

   ngOnInit(){
    this.route.events.subscribe((event) => {
      if(event['url'] && event['url'].indexOf('manage-cart')===-1 && this.modalRef)
        this.modalRef.hide();
    });
    this.storefront$ = this.storefrontService.getStorefront();
  }

  ngOnChanges() {}

  /**
   * Removes the provided CartItem from the user's current active cart.
   *
   * @param item CartItem instance to remove from cart.
   * @param evt Event associated with the user action.
   * @fires CartService.removeCartItem()
   */
  removeCartItem(item: CartItem, evt) {
    evt.stopPropagation();
    this.cart.LineItems.forEach(lineItem => {
      if (item.LineNumber === lineItem.LineNumber) {
        lineItem._metadata = { _deleting: true };
        this.cartService.removeCartItem(lineItem);
      }
    });
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
    this.modalRef = this.modalService.show(template,{class:'modal-lg'});
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
