import { Component, OnChanges, Input, TemplateRef, ViewChild, Output, EventEmitter  } from '@angular/core';
import { Cart, QuoteService, TemplateService, CartItem, Quote } from '@apttus/ecommerce';
import * as _ from 'lodash';
import { PlatformService } from '@apttus/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cart-summary',
  templateUrl: `./summary.component.html`,
  styles: [`
    .small{
      font-size: smaller;
    }
    li.list-group-item .details small:not(:last-child){
      border-right: 1px solid gray;
      padding-right: 6px;
      margin-right: 6px;
    }
    .confirmation .oi{
        padding: 26px;
        font-size: 75px;
    }
  `]
})
export class SummaryComponent implements OnChanges {
  @Input() cart: Cart;
  @Input() form: NgForm;
  @Input() spinner: boolean;
  @Input() accountId: string;
  @Input() isLoggedIn: Observable<boolean>;
  @ViewChild('confirmationTemplate') confirmationTemplate: TemplateRef<any>;
  @Output() onSubmitOrder: EventEmitter<string> = new EventEmitter();
  
  state: SummaryState;
  modalRef: BsModalRef;
  lineItem: CartItem;
  confirmationModal: BsModalRef;
  generatedQuote: Quote;

  get itemCount(): number{
    let count = 0;
    if(_.get(this.cart, 'LineItems'))
      this.cart.LineItems.filter(p => p.LineType === 'Product/Service').forEach(r => count += Number(r.Quantity));
    return count;
  }

  constructor(private quoteService: QuoteService, private templateService: TemplateService, private platformService: PlatformService, private modalService: BsModalService) {
    this.state = {
      configurationMessage: null,
      downloadLoading: false,
      requestQuoteMessage: null,
      requestQuoteLoading: false
    };
  }

  ngOnChanges() {}

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

  generatePdf(){}

  openModal(lineItem: CartItem, template: TemplateRef<any>) {
    this.lineItem = lineItem;
    this.modalRef = this.modalService.show(template);
  }

  submitOrder() {
    this.onSubmitOrder.emit();
  }
}

export interface SummaryState{
  configurationMessage: string;
  downloadLoading: boolean;
  requestQuoteMessage: string;
  requestQuoteLoading: boolean;
}
