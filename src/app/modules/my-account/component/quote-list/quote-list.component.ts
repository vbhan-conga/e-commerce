import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuoteService, Quote, CartService, PriceService } from '@apttus/ecommerce';
import { Observable } from 'rxjs';
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
  quoteList$: Observable<Array<Quote>>;
  quote: Quote = new Quote();
  aggregateData$: Observable<QuoteListView>;
  quotesByStatus$: Observable<Object>;
  quotesByDueDate$: Observable<Object>;
  minDaysFromDueDate: number = 7;
  maxDaysFromDueDate: number = 14;
  actionConfiguration: object;
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
    this.aggregateData$ = this.quoteService.query({
      aggregate: true,
      groupBy: ['Approval_Stage', 'RFP_Response_Due_Date']
    })
    .pipe(
      map(aggregateData => {
        return {
          total: _.get(aggregateData, 'total_records', _.sumBy(aggregateData, 'total_records')),
          totalAmount: _.get(aggregateData, 'SUM_Grand_Total', _.sumBy(aggregateData, 'SUM_Grand_Total')),
          quotesByStatus: _.isArray(aggregateData)
            ? _.omit(_.mapValues(_.groupBy(aggregateData, 'Apttus_Proposal__Approval_Stage__c'), s => _.sumBy(s, 'total_records')), 'null')
            : _.zipObject([_.get(aggregateData, 'Apttus_Proposal__Approval_Stage__c')], _.map([_.get(aggregateData, 'Apttus_Proposal__Approval_Stage__c')], key => _.get(aggregateData, 'total_records'))),
          quotesByDueDate: _.isArray(aggregateData)
            ? _.omit(_.mapKeys(_.mapValues(_.groupBy(aggregateData, 'Apttus_Proposal__RFP_Response_Due_Date__c'), s => _.sumBy(s, 'total_records')), _.bind(this.generateLabels, this)), 'null')
            : _.zipObject([_.get(aggregateData, 'Apttus_Proposal__RFP_Response_Due_Date__c')], _.map([_.get(aggregateData, 'Apttus_Proposal__RFP_Response_Due_Date__c')], key => _.get(aggregateData, 'total_records')))
        };
      })
    );
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
  generateLabels(date): string {
    const today = moment(new Date());
    const dueDate = (date) ? moment(date) : null;
    if (dueDate && dueDate.diff(today, 'days') < this.minDaysFromDueDate) {
      if (!_.includes(this.colorPalette, 'rgba(208, 2, 27, 1)')) this.colorPalette.push('rgba(208, 2, 27, 1)');
      return '< ' + this.minDaysFromDueDate + ' Days';
    }
    else if (dueDate && dueDate.diff(today, 'days') > this.minDaysFromDueDate && dueDate.diff(today, 'days') < this.maxDaysFromDueDate) {
      if (!_.includes(this.colorPalette, 'rgba(245, 166, 35, 1)')) this.colorPalette.push('rgba(245, 166, 35, 1)');
      return '< ' + this.maxDaysFromDueDate + ' Days';
    }
    else {
      if (!_.includes(this.colorPalette, 'rgba(43, 180, 39, 1)')) this.colorPalette.push('rgba(43, 180, 39, 1)');
      return '> ' + this.maxDaysFromDueDate + ' Days';
    }
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
      .subscribe(() => this.router.navigate(['/checkout']));
  }

  /** @ignore */
  send(){

  }
}

/** @ignore */
export interface QuoteListView {
  total: number;
  totalAmount: number;
  quotesByStatus: object;
  quotesByDueDate: object;
}