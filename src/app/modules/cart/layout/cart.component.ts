import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy, NgZone } from '@angular/core';
import { User, Account, Cart, CartService, Order, OrderService, Contact, ContactService, UserService, AccountService, EmailService, PaymentTransaction, AccountInfo } from '@apttus/ecommerce';
import { Observable, Subscription } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Card } from '../component/card-form/card-form.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from '@apttus/core';
import { ExceptionService, PriceSummaryComponent, BreadcrumbLink } from '@apttus/elements';

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
export class CartComponent implements OnInit, OnDestroy {
  @ViewChild('addressTabs', {static: false}) addressTabs: any;
  @ViewChild('addressInfo', { static: false }) addressInfo: ElementRef;
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @ViewChild('confirmationTemplate', { static: false }) confirmationTemplate: TemplateRef<any>;
  @ViewChild('priceSummary', { static: false }) priceSummary: PriceSummaryComponent;

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
   * Default is blank
   */
  paymentState: 'PONUMBER' | 'INVOICE' | 'PAYNOW' | '' = '';
  /**
   * Stores confirmation model
   */
  confirmationModal: BsModalRef;
  /**
   * A hot observable containing the user information
   */
  user$: Observable<User>;
  /**
   * A hot observable containing the account information
   */
  account$: Observable<Account>;
  /**
   * Current selected locale for logged in user
  */
  currentUserLocale: string;
  /**
   * flag to check the payment process
  */
  isPaymentCompleted: boolean = false;
  /**
   * flag to check if the flow started for payment
  */
  isPayForOrderEnabled: boolean = false;
  /**
   * flag to enable make payment button against of payment method
  */
  isMakePaymentRequest: boolean = false;
  /**
   * payment transaction object
  */
  paymentTransaction: PaymentTransaction;
  /**
   * order amount to charge on payment
  */
  orderAmount: string;
  errMessages: any = {
    requiredFirstName: '',
    requiredLastName: '',
    requiredEmail: ''
  };
  cart: Cart;
  isLoggedIn: boolean;
  shipToAccount$: Observable<Account>;
  billToAccount$: Observable<Account>;
  pricingSummaryType: 'checkout' | 'paymentForOrder' | '' = 'checkout';
  model = {
    BillToAccountId: '',
    ShipToAccountId: '',
    SoldToAccountId: ''
  };
  breadcrumbs;

  private subscriptions: Subscription[] = [];

  constructor(private cartService: CartService,
              public configurationService: ConfigurationService,
              private orderService: OrderService,
              private modalService: BsModalService,
              public contactService: ContactService,
              private translate: TranslateService,
              private userService: UserService,
              private accountService: AccountService,
              private emailService: EmailService,
              private router: Router,
              private ngZone: NgZone,
              private toastr: ToastrService,
              private exceptionService: ExceptionService) {
    this.uniqueId = _.uniqueId();
  }

  ngOnInit() {
    this.subscriptions.push(this.userService.isLoggedIn().subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn));
    this.subscriptions.push(this.userService.getCurrentUserLocale(false).subscribe((currentLocale) => this.currentUserLocale = currentLocale));

    if (!this.isLoggedIn)
      this.paymentState = 'PAYNOW';

    this.account$ = this.accountService.getCurrentAccount();
    this.subscriptions.push(this.cartService.getMyCart().subscribe(cart => {
      this.cart = cart;

      // Setting default values
      this.model.BillToAccountId = _.get(cart, 'AccountId');
      this.model.ShipToAccountId = _.get(cart, 'AccountId');
      this.model.SoldToAccountId = _.get(cart, 'AccountId');
    }));
    this.subscriptions.push(this.contactService.getMyContact().subscribe(c => this.primaryContact = c));
    this.order = new Order();
    this.card = {} as Card;
    this.user$ = this.userService.me();
    this.translate.stream(['PRIMARY_CONTACT', 'AOBJECTS']).subscribe((val: string) => {
      this.errMessages.requiredFirstName = val['PRIMARY_CONTACT']['INVALID_FIRSTNAME'];
      this.errMessages.requiredLastName = val['PRIMARY_CONTACT']['INVALID_LASTNAME'];
      this.errMessages.requiredEmail = val['PRIMARY_CONTACT']['INVALID_EMAIL'];
      this.breadcrumbs = [
        {
          label: val['AOBJECTS']['CART'],
          route: [`/carts/active`]
        }
      ];
    });

    this.onBillToChange();
    this.onShipToChange();
  }

  /**
   * Allow to switch address tabs if billing and shipping address are diffrent.
   *
   * @param evt Event that identifies if Shipping and billing addresses are same.
   *
   */
  selectTab(evt) {
    if (evt)
      this.staticTabs.tabs[0].active = true;
    else {
      setTimeout(() => this.staticTabs.tabs[1].active = true, 50);
    }
  }

  /**
   * Allows user to submit order. Convert a cart to order and submit it.
   */
  submitOrder() {
    const orderAmountGroup = _.find(_.get(this.cart, 'SummaryGroups'), c => _.get(c, 'LineType') === 'Grand Total');
    this.orderAmount = _.defaultTo(_.get(orderAmountGroup, 'NetPrice', 0).toString(), '0');
    this.loading = true;
    if (this.isLoggedIn) {
      let selectedAcc: AccountInfo = {
        BillToAccountId: this.model.BillToAccountId,
        ShipToAccountId: this.model.ShipToAccountId,
        SoldToAccountId: this.model.SoldToAccountId
      };

      this.convertCartToOrder(this.order, this.primaryContact, null, selectedAcc);
    }
    else {
      if (this.shippingEqualsBilling) {
        this.primaryContact.OtherCity = this.primaryContact.MailingCity;
        this.primaryContact.OtherStreet = this.primaryContact.MailingStreet;
        this.primaryContact.OtherState = this.primaryContact.MailingState;
      }

      // Removing MailingCountry, OtherCountry, OtherState and OtherStateCode from primary contact object
      delete this.primaryContact.OtherCountry;
      delete this.primaryContact.OtherState;

      this.convertCartToOrder(this.order, this.primaryContact);
    }
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

  onBillToChange() {
    this.billToAccount$ = this.accountService.get([this.model.BillToAccountId]).pipe(map(res => res[0]));
  }

  onShipToChange() {
    this.shipToAccount$ = this.accountService.get([this.model.ShipToAccountId]).pipe(map(res => res[0]));
  }

  convertCartToOrder(order: Order, primaryContact: Contact, cart?: Cart, selectedAccount?: AccountInfo) {
    this.loading = true;
    this.orderService.convertCartToOrder(order, primaryContact, cart, selectedAccount)
      .subscribe(
        orderResponse => this.ngZone.run(() => {
          this.loading = false;
          this.orderConfirmation = orderResponse;
          (this.paymentState === 'PAYNOW') ? this.requestForPayment(this.orderConfirmation) : this.onOrderConfirmed();
        }),
        err => {
          this.exceptionService.showError(err);
          this.loading = false;
        }
      );
  }

  /**
   * Prepare payment request transaction data for payment
   *
   * @param user current logged in user details
   * @param billingAccount selected billing account for logged in user
   * @param currentLocale get current user locale with hyphen
   * @returns PaymentTransaction which conatins payment request details
   */
  requestForPayment(orderDetails: Order) {
    this.paymentTransaction = new PaymentTransaction();
    this.paymentTransaction.Currency = _.defaultTo(_.get(orderDetails, 'CurrencyIsoCode'),this.configurationService.get('defaultCurrency'));
    this.paymentTransaction.CustomerFirstName = _.get(this.primaryContact, 'FirstName');
    this.paymentTransaction.CustomerLastName = _.get(this.primaryContact, 'LastName');
    this.paymentTransaction.CustomerEmailAddress = _.get(this.primaryContact, 'Email');
    this.paymentTransaction.CustomerAddressLine1 = this.isLoggedIn ? _.get(orderDetails.BillToAccount, 'BillingStreet') : _.get(this.primaryContact, 'MailingStreet');
    this.paymentTransaction.CustomerAddressCity = this.isLoggedIn ? _.get(orderDetails.BillToAccount, 'BillingCity') : _.get(this.primaryContact, 'MailingCity');
    this.paymentTransaction.CustomerAddressStateCode = this.isLoggedIn ? _.get(orderDetails.BillToAccount, 'BillingAddress.stateCode') : _.get(this.primaryContact, 'MailingStateCode');
    this.paymentTransaction.CustomerAddressCountryCode = this.isLoggedIn ? _.get(orderDetails.BillToAccount, 'BillingAddress.countryCode') : _.get(this.primaryContact, 'MailingCountryCode');
    this.paymentTransaction.CustomerAddressPostalCode = this.isLoggedIn ? _.get(orderDetails.BillToAccount, 'BillingAddress.postalCode') : _.get(this.primaryContact, 'MailingPostalCode');
    this.paymentTransaction.CustomerBillingAccountName = _.get(orderDetails.BillToAccount, 'Name');
    this.paymentTransaction.CustomerBillingAccountID = _.get(orderDetails.BillToAccount, 'Id');
    this.paymentTransaction.isUserLoggedIn = this.isLoggedIn;
    this.paymentTransaction.OrderAmount =  this.orderAmount;
    this.paymentTransaction.Locale = this.currentUserLocale ;
    this.paymentTransaction.OrderName = _.get(orderDetails, 'Name') ;
    this.paymentTransaction.OrderGeneratedID = _.get(orderDetails, 'Id');
    this.isPayForOrderEnabled = true;
    this.pricingSummaryType = '';
  }

  /**
   * Submit paymen request for selected payment method
  */
  submitPayment() {
    this.isMakePaymentRequest = true;
    this.priceSummary.setLoading(true);
  }

  /**
   * Set the PAYNOW option if payment method exist
  */
  selectDefaultPaymentOption(isPaymentMethodExist) {
    if (isPaymentMethodExist) {
      this.paymentState = 'PAYNOW';
    }
    else {
      this.paymentState = '';
    }
  }
  /**
   * Enabled make payment button if method selected
  */
  onSelectingPaymentMethod(eve) {
    setTimeout(() => {
      if (eve) {
        this.pricingSummaryType = 'paymentForOrder';
      }
      else {
        this.pricingSummaryType = '';
      }
    });
  }

  /**
   * set event true of payment complete
  */
  onPaymentComplete(paymentStatus: string) {
    if (paymentStatus !== 'Success') {
      this.translate.stream(['PAYMENT_METHOD_LABELS.ERROR_MSG', 'PAYMENT_METHOD_LABELS.ERROR_TITLE']).subscribe((val: string) => {
        this.toastr.error(val['PAYMENT_METHOD_LABELS.ERROR_MSG'] + paymentStatus, val['PAYMENT_METHOD_LABELS.ERROR_TITLE']);
      });
    }
    else {
      this.isPaymentCompleted = true;
    }
    if (_.get(this.orderConfirmation, 'Id'))
      this.emailService.guestUserNewOrderNotification(this.orderConfirmation.Id, `${this.configurationService.resourceLocation()}#/orders/${this.orderConfirmation.Id}`).pipe(take(1)).subscribe();
  }

  /**
    * Redirect to Order detail page
   */
  redirectOrderPage() {
    this.ngZone.run(() => {
      this.router.navigate(['/orders', this.orderConfirmation.Id]);
    });
  }

  onOrderConfirmed() {
    this.ngZone.run(() => {
      this.confirmationModal = this.modalService.show(this.confirmationTemplate, { class: 'modal-lg' });
    });
    if (_.get(this.orderConfirmation, 'Id'))
      this.emailService.guestUserNewOrderNotification(this.orderConfirmation.Id, `${this.configurationService.resourceLocation()}#/orders/${this.orderConfirmation.Id}`).pipe(take(1)).subscribe();
  }


  closeModal() {
    this.confirmationModal.hide();
    this.redirectOrderPage();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
