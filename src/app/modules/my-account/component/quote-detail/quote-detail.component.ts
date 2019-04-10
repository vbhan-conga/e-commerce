import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { QuoteService, Quote, QuoteLineItem } from '@apttus/ecommerce';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

/** @ignore */
/**
 * Component loads individual quote from param quoteID.
 */
@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss']
})
export class QuoteDetailComponent implements OnInit {

  quote$: Observable<Quote>;
  selectedLineItem: QuoteLineItem;
  modalRef: BsModalRef;
  /**
   * The product identifier set in the configuration file.
   */
  identifier: string = 'Id';

  /**
   * @ignore
   */
  constructor(public quoteService: QuoteService, private activatedRoute: ActivatedRoute, private modalService: BsModalService) {}

  /**
   * @ignore
   */
  ngOnInit() {
    this.quoteService.configurationService.get('productIdentifier');
    this.quote$ = this.activatedRoute.params.flatMap(r => this.quoteService.getQuoteByName(r.quoteId));
    this.quote$.subscribe(r => console.log(r));
  }

  /**
   * Loads product configuration for given current quote.
   * @param template Modal template to load configuration for selected product.
   * @param lineItem Selected line item for quote.
   */
  openModal(template: TemplateRef<any>, lineItem: QuoteLineItem) {
    this.selectedLineItem = lineItem;
    this.modalRef = this.modalService.show(template);
  }
}

export class CustomQuote extends Quote {
  Discounted_Price__c: number = 0;
}