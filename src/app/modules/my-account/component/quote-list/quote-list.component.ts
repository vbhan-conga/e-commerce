import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuoteService, Quote, CartService, PriceService } from '@apttus/ecommerce';
import { Observable, Subscription } from 'rxjs';
import { QuoteActions } from './quote-actions.component';
import { Router } from '@angular/router';
import { ACondition, APageInfo, ASort } from '@apttus/core';
import { TranslateService } from '@ngx-translate/core';
import { take, map, flatMap } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';

/** @ignore */
/**
 * Loads list of quotes for logged in user.
 */
@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit, OnDestroy {
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
  quoteList$: Observable<Array<Quote>>;
  quote: Quote = new Quote();
  quoteAggregate: any;
  quotesByStatus: Object;
  quotesByDueDate: Object;
  totalQuoteAmount: number = 0;
  subscriptions: Array<Subscription> = [];
  actionConfiguration: object;
  minDaysFromDueDate: number;
  maxDaysFromDueDate: number;
  colorPalette: Array<String> = [];
  /** @ignore */
  paginationButtonLabels: any = {
    first: '',
    previous: '',
    next: '',
    last: ''
  };

  /** @ignore */
  constructor(private quoteService: QuoteService, private cartService: CartService, private router: Router, private translateService: TranslateService, private priceService: PriceService) {
    this.actionConfiguration = new QuoteActions().actionConfiguration;
  }

  /** @ignore */
  ngOnInit() {
    this.loadQuotes(this.currentPage);
    this.quoteService.aggregate([new ACondition(Quote, 'Id', 'NotNull', null)]).pipe(take(1)).subscribe(res => this.quoteAggregate = res);
    this.subscriptions.push(this.quoteService.where([new ACondition(this.quoteService.type,'Id','NotNull',null)]).subscribe((res: Array<Quote>) => {
      const quoteListData = res;
      this.totalQuoteAmount = 0;
      this.quotesByStatus = {};
      this.quotesByDueDate = {};
      this.colorPalette = [];
      _.filter(quoteListData, 'QuoteLineItems').map(quote => {
        this.totalQuoteAmount += _.sum(_.filter(_.get(quote, 'QuoteLineItems'),lineItem => (lineItem.LineType === 'Product/Service' || lineItem.LineType === 'Misc')).map(res => (res.NetPrice) ? res.NetPrice : 0));
      });
      if(quoteListData){
        quoteListData.map(r => r['Approval_Stage']).forEach(a => this.quotesByStatus[a] = (!this.quotesByStatus[a]) ? 1 : this.quotesByStatus[a] + 1);
        quoteListData.map(r => {
          let res = this.generateLabels(r['RFP_Response_Due_Date']);
          if(!this.quotesByDueDate[res]){
            this.quotesByDueDate[res] = 1;
            this.loadPalette(res);
          }
          else this.quotesByDueDate[res] = this.quotesByDueDate[res] + 1;
        });
      }
    }));
    this.translateService.stream('PAGINATION').subscribe((val: string) => {{}
      this.paginationButtonLabels.first = val['FIRST'];
      this.paginationButtonLabels.previous = val['PREVIOUS'];
      this.paginationButtonLabels.next = val['NEXT'];
      this.paginationButtonLabels.last = val['LAST'];
   });
  }

  /**
   * Loads quotes for logged in user by current page number.
   * @param page Current page number used by pagination component.
   */
  loadQuotes(page){
    this.minDaysFromDueDate = 7;
    this.maxDaysFromDueDate = 14;
    // this.quoteList$ = this.quoteService.getMyQuotes(null, this.limit, page);
    this.quoteList$ = this.quoteService.where(null, 'AND', null, [new ASort(this.quoteService.type, 'CreatedDate', 'DESC')], new APageInfo(this.limit, page));
  }

/**@ignore
 */
  generateLabels(date): string{
    const today = moment(new Date());
    const dueDate = (date) ? moment(date) : null;
      if(dueDate && dueDate.diff(today,'days') < this.minDaysFromDueDate ) {
        return '< '+ this.minDaysFromDueDate +' Days';
      }
      else if (dueDate && dueDate.diff(today,'days') > this.minDaysFromDueDate && dueDate.diff(today,'days') < this.maxDaysFromDueDate) {
        return '< '+ this.maxDaysFromDueDate + ' Days';
      }
      else return '> ' + this.maxDaysFromDueDate +' Days';
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
      .pipe(
        take(1),
        map(res => res[0]),
        flatMap(cart => this.cartService.setCartActive(cart))
      )
      .subscribe(() => this.router.navigate(['/cart']));
  }

  /** @ignore */
  send(){

  }
  /**
   * @ignore
   */
  loadPalette(res){
    switch(res) {
      case '< '+ this.minDaysFromDueDate +' Days':
      this.colorPalette.push('rgba(208, 2, 27, 1)');
      break;
      case '< '+ this.maxDaysFromDueDate +' Days':
      this.colorPalette.push('rgba(245, 166, 35, 1)');
      break;
      case '> '+ this.maxDaysFromDueDate +' Days':
      this.colorPalette.push('rgba(43, 180, 39, 1)');
      break;
    }
  }
  ngOnDestroy(){
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}