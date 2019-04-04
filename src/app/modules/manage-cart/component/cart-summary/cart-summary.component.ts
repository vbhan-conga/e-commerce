import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges } from '@angular/core';
import { Cart, StorefrontService, Storefront } from '@apttus/ecommerce';
import { QuoteService, Quote } from '@apttus/ecommerce';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ConstraintRuleService } from '@apttus/constraint-rules';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss']
})
export class CartSummaryComponent implements OnInit, OnChanges {
  @Input() cart: Cart;
  @ViewChild('confirmationTemplate') confirmationTemplate: TemplateRef<any>;

  state: SummaryState;
  generatedQuote: Quote;
  confirmationModal: BsModalRef;
  hasErrors: boolean = true;
  totalPromotions: number = 0;
  storefront$: Observable<Storefront>;

  constructor(private quoteService: QuoteService, private modalService: BsModalService, private crService: ConstraintRuleService, private storefrontService: StorefrontService) {
    this.state = {
      configurationMessage: null,
      downloadLoading: false,
      requestQuoteMessage: null,
      requestQuoteLoading: false
    };
  }

  ngOnInit() {
    this.crService.hasPendingErrors().subscribe(val => this.hasErrors = val);
    this.storefront$ = this.storefrontService.getStorefront();
  }

   ngOnChanges() {
     this.totalPromotions = ((this.cart && _.get(this.cart,'LineItems.length') > 0))?_.sum(this.cart.LineItems.map(res=> res.IncentiveAdjustmentAmount)):0;
    }
  createQuote() {
    this.state.requestQuoteLoading = true;
    this.quoteService.convertCartToQuote().subscribe(
      res => {
        this.generatedQuote = res;
        this.state.requestQuoteLoading = false;
        this.confirmationModal = this.modalService.show(this.confirmationTemplate);
      },
      err => {
        this.state.requestQuoteMessage = 'An error occurred generating your quote. Please contact an administrator';
        this.state.requestQuoteLoading = false;
      }
    );
  }
}

export interface SummaryState {
  configurationMessage: string;
  downloadLoading: boolean;
  requestQuoteMessage: string;
  requestQuoteLoading: boolean;
}