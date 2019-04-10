import { Component, OnInit } from '@angular/core';
import { QuoteService, Quote, CartService } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';
import { QuoteActions } from './quote-actions.component';
import { Router } from '@angular/router';
import { ACondition } from '@apttus/core';

/** @ignore */
/**
 * Loads list of quotes for logged in user.
 */
@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {
  /**
   * The current page used by the pagination component.
   */
  currentPage: number = 1;
  /**
   * Number of records per page used by the pagination component.
   */
  limit: number = 10;

  /**
   * Array of quotes for current page number.
   */
  quoteList: Array<CustomQuote>;
  quoteAggregate$: Observable<Array<any>>;
  actionConfiguration: object;

  /** @ignore */
  constructor(private quoteService: QuoteService, private cartService: CartService, private router: Router) {
    this.actionConfiguration = new QuoteActions().actionConfiguration;
  }

  /** @ignore */
  ngOnInit() {
    this.loadQuotes(this.currentPage);
   this.quoteAggregate$ = this.quoteService.aggregate([new ACondition(Quote, 'Id', 'NotNull', null)]).map(res => res[0]);
  }

  /**
   * Loads quotes for logged in user by current page number.
   * @param page Current page number used by pagination component.
   */
  loadQuotes(page){
    this.quoteList = null;
    this.quoteService.getMyQuotes(null, this.limit, page).subscribe((res: Array<CustomQuote>) => this.quoteList = res);

  }

  /** @ignore */
  downloadPdf(){

  }

  /** @ignore */
  delete(quote: Quote){

  }

  /** @ignore */
  createOrder(){

  }

  /** @ignore */
  submitForApproval(){

  }

  /** @ignore */
  activateCartForQuote(quote: Quote){
    // this.cartService.where(`Apttus_QPConfig__Proposald__c = {0}`, quote.Id)
    this.cartService.where([new ACondition(this.cartService.type, 'QuoteId', 'Equal', quote.Id)])
      .take(1)
      .map(res => res[0])
      .flatMap(cart => this.cartService.setCartActive(cart))
      .subscribe(() => this.router.navigate(['/cart']));
  }

  /** @ignore */
  send(){

  }
}

export class CustomQuote extends Quote{
  Discounted_Price__c: number = 0;
}
