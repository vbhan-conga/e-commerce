import { Component, OnInit } from '@angular/core';
import { QuoteService, Quote, CartService, PriceService, LocalCurrencyPipe } from '@apttus/ecommerce';
import { Observable, of, combineLatest } from 'rxjs';
import { QuoteActions } from './quote-actions.component';
import { Router } from '@angular/router';
import { ACondition, AFilter } from '@apttus/core';
import { TranslateService } from '@ngx-translate/core';
import { take, map, flatMap } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';
import { TableOptions } from '@apttus/elements';

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

  type = Quote;

  tableOptions: TableOptions = {
    columns: [
      {
        prop: 'Name'
      },
      {
        prop: 'Proposal_Name'
      },
      {
        prop: 'Approval_Stage'
      },
      {
        prop: 'PriceListId'
      },
      {
        prop: 'Grand_Total',
        value: (record) => {
          return this.currencyPipe.transform(_.get(_.find(_.get(record, 'ProposalSummaryGroups'), {LineType : 'Grand Total'}), 'NetPrice'));
        }
      },
      {
        prop: 'ExpectedStartDate'
      },
      {
        prop: 'ExpectedEndDate'
      },
      {
        prop: 'LastModifiedDate'
      }
    ],
    children : ['ProposalSummaryGroups']
  };
  /**
   * Array of quotes for current page number.
   */
  quoteList$: Observable<Array<Quote>>;
  quote: Quote = new Quote();
  view$: Observable<QuoteListView>;
  quotesByStatus$: Observable<Object>;
  quotesByDueDate$: Observable<Object>;
  minDaysFromDueDate: number = 7;
  maxDaysFromDueDate: number = 14;
  actionConfiguration: object;
  colorPalette: Array<String> = ['#D22233', '#F2A515', '#6610f2', '#008000', '#17a2b8', '#0079CC', '#CD853F', '#6f42c1', '#20c997', '#fd7e14'];
  filterList: Array<AFilter> = [];

  /** @ignore */
  constructor(private quoteService: QuoteService, private cartService: CartService, private router: Router, private currencyPipe: LocalCurrencyPipe) {
    this.actionConfiguration = new QuoteActions().actionConfiguration;
  }

  /** @ignore */
  ngOnInit() {
    this.loadViewData();
  }

  loadViewData() {
    this.view$ = combineLatest(this.quoteService.query({
      aggregate: true,
      groupBy: ['Approval_Stage', 'RFP_Response_Due_Date'],
      filters: this.filterList
    }),
    this.quoteService.getGrandTotalByApprovalStage())
    .pipe(
      map(([data, totalByStage]) => {
        return {
          tableOptions: _.clone(_.assign(this.tableOptions, {filters: this.filterList})),
          total: _.get(data, 'total_records', _.sumBy(data, 'total_records')),
          totalAmount: _.get(totalByStage, 'NetPrice', _.sumBy(totalByStage, 'NetPrice')),
          amountsByStatus: _.isArray(totalByStage)
          ? _.omit(_.mapValues(_.groupBy(totalByStage, 'Stage'), s => _.sumBy(s, 'NetPrice')), 'null')
          : _.zipObject([_.get(totalByStage, 'Stage')], _.map([_.get(totalByStage, 'Stage')], key => _.get(totalByStage, 'NetPrice'))),
          quotesByStatus: _.isArray(data)
            ? _.omit(_.mapValues(_.groupBy(data, 'Apttus_Proposal__Approval_Stage__c'), s => _.sumBy(s, 'total_records')), 'null')
            : _.zipObject([_.get(data, 'Apttus_Proposal__Approval_Stage__c')], _.map([_.get(data, 'Apttus_Proposal__Approval_Stage__c')], key => _.get(data, 'total_records'))),
          quotesByDueDate: _.isArray(data)
            ? _.omit(_.mapKeys(_.mapValues(_.groupBy(data, 'Apttus_Proposal__RFP_Response_Due_Date__c'), s => _.sumBy(s, 'total_records')), _.bind(this.generateLabels, this)), 'null')
            : _.zipObject([_.get(data, 'Apttus_Proposal__RFP_Response_Due_Date__c')], _.map([_.get(data, 'Apttus_Proposal__RFP_Response_Due_Date__c')], key => _.get(data, 'total_records')))
        } as QuoteListView;
      })
    );
  }
  /** @ignore */
  handleFilterListChange(event: any) {
    this.filterList = event;
    this.loadViewData();
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
  tableOptions: TableOptions;
  total: number;
  totalAmount: number;
  quotesByStatus: object;
  quotesByDueDate: object;
}