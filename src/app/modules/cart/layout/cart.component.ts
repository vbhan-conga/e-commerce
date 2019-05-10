import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Cart, CartService, Order, OrderService, Contact, ContactService, UserService, AccountService } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Card } from '../component/card-form/card-form.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import * as _ from 'lodash';

/**
 * Cart component, contains details such as
 * 
 * Addresses (Billing/Shipping), 
 * Payment Method (Card, PO),
 * Cart Summary (line items in current cart)
 * 
 * Example Usage:
 * @example
 * <app-cart></app-cart>
 */
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @ViewChild('addressTabs') addressTabs: any;
  @ViewChild('addressInfo') addressInfo: ElementRef;
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  @ViewChild('confirmationTemplate') confirmationTemplate: TemplateRef<any>;

  /**
   * A hot observable containing the single cart instance
   */
  cart$: Observable<Cart>;
  /**
   * An Observable containing the current contact record
   */
  primaryContact: Contact;
  /**
   * If shilling and billing addresses are same or not.
   */
  shippingEqualsBilling: boolean = true;
  /**
   * Order Object Model
   */
  order: Order;
  /**
   * Order Response Object Model
   */
  orderConfirmation: Order;
  /**
   * Card Model (name, card number, expiration date, etc)
   */
  card: Card;
  /**
   * Loading flag for spinner
   */
  loading: boolean = false;
  /**
   * Unique Id 
   */
  uniqueId: string;
  /**
   * Payment state such as Card and Invoice
   * Default is Card
   */
  paymentState: 'CARD' | 'INVOICE' = 'CARD';
  /**
   * Stores confirmation model
   */
  confirmationModal: BsModalRef;

  /**
    * A hot observable containing the logged in information
  */
  isLoggedIn$: Observable<boolean>;
  accountId: string;

  constructor(private cartService: CartService, private orderService: OrderService, private modalService: BsModalService, public contactService: ContactService, private userService: UserService, private accountService: AccountService) {
    this.uniqueId = _.uniqueId();
  }

  ngOnInit() {
    this.isLoggedIn$ = this.userService.isLoggedIn();
    this.accountService.getCurrentAccount().subscribe(res => this.accountId = res.Id);
    this.cart$ = this.cartService.getMyCart();
    this.contactService.getMyContact().subscribe(c => this.primaryContact = c);
    this.order = new Order();
    this.card = {} as Card;
  }

  /**
   * Allow to switch address tabs if billing and shipping address are diffrent.
   * 
   * @param evt Event that identifies if Shipping and billing addresses are same.
   * 
   */
  selectTab(evt){
      if (evt)
        this.staticTabs.tabs[0].active = true;
      else{
        setTimeout(() => this.staticTabs.tabs[1].active = true, 50);
      }
  }

  /**
   * Allows user to submit order. Convert a cart to order and submit it.
   */
  submitOrder(){
    if (this.shippingEqualsBilling){
      this.primaryContact.OtherCity = this.primaryContact.MailingCity;
      this.primaryContact.OtherStreet = this.primaryContact.MailingStreet;
      this.primaryContact.OtherState = this.primaryContact.MailingState;
      this.primaryContact.OtherStateCode = this.primaryContact.MailingStateCode;
      this.primaryContact.OtherPostalCode = this.primaryContact.MailingPostalCode;
      this.primaryContact.OtherCountryCode = this.primaryContact.MailingCountryCode;
    }

    //Removing MailingCountry, OtherCountry, OtherState and OtherStateCode from primary contact object
    delete this.primaryContact.MailingCountry;
    delete this.primaryContact.OtherCountry;
    delete this.primaryContact.OtherState;
    delete this.primaryContact.OtherStateCode;
    
    this.loading = true;
    this.orderService.convertCartToOrder(this.order, this.primaryContact).subscribe(
      res => {
        this.loading = false;
        this.orderConfirmation = res;
        this.confirmationModal = this.modalService.show(this.confirmationTemplate);
      },
      err => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  /**
   * Generates a unique id for different components
   * 
   * @param id ids such as 'firstName', 'lastName', 'email', etc
   * @returns uniqueid
   */
  public getId(id: string): string {
    return this.uniqueId + '_' + id;
  }
}
