import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { clone, assign, find, get, isArray, groupBy, sumBy, omit, zipObject, mapKeys, mapValues, map, bind, includes } from 'lodash';

import { AFilter } from '@apttus/core';
import { QuoteService, Quote, LocalCurrencyPipe } from '@apttus/ecommerce';
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
          return this.currencyPipe.transform(get(find(get(record, 'ProposalSummaryGroups'), { LineType: 'Grand Total' }), 'NetPrice'));
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
    lookups: [
      {
        field: 'PriceListId'
      },
      {
        field: 'Account'
      },
      {
        field: 'Opportunity'
      },
      {
        field: 'Primary_Contact'
      },
      {
        field: 'BillToAccountId'
      },
      {
        field: 'ShipToAccountId'
      },
      {
        field: 'Owner'
      }
    ],
    children: ['ProposalSummaryGroups']
  };
  /**
   * Array of quotes for current page number.
   */
  quote: Quote = new Quote();
  minDaysFromDueDate: number = 7;
  maxDaysFromDueDate: number = 14;
  colorPalette: Array<String> = ['#D22233', '#F2A515', '#6610f2', '#008000', '#17a2b8', '#0079CC', '#CD853F', '#6f42c1', '#20c997', '#fd7e14'];
  filterList: Array<AFilter> = [];
  totalAmount$: Observable<number>;
  amountsByStatus$: Observable<number>;
  totalRecords$: Observable<number>;
  quotesByStatus$: Observable<number>;
  quotesByDueDate$: Observable<number>;

  /** @ignore */
  constructor(private quoteService: QuoteService, private currencyPipe: LocalCurrencyPipe) { }

  /** @ignore */
  ngOnInit() {
    this.loadViewData();
  }

  private loadViewData() {
    this.quoteService.query({
      aggregate: true,
      groupBy: ['Approval_Stage', 'RFP_Response_Due_Date'],
      filters: this.filterList
    })
      .pipe(take(1))
      .subscribe(data => {
        this.tableOptions = clone(assign(this.tableOptions, { filters: this.filterList }));
        this.totalRecords$ = of(get(data, 'total_records', sumBy(data, 'total_records')));

        this.quotesByStatus$ = of(
          isArray(data)
            ? omit(mapValues(groupBy(data, 'Apttus_Proposal__Approval_Stage__c'), s => sumBy(s, 'total_records')), 'null')
            : zipObject([get(data, 'Apttus_Proposal__Approval_Stage__c')], map([get(data, 'Apttus_Proposal__Approval_Stage__c')], key => get(data, 'total_records')))
        );

        this.quotesByDueDate$ = of(
          isArray(data)
            ? omit(mapKeys(mapValues(groupBy(data, 'Apttus_Proposal__RFP_Response_Due_Date__c'), s => sumBy(s, 'total_records')), bind(this.generateLabels, this)), 'null')
            : zipObject([get(data, 'Apttus_Proposal__RFP_Response_Due_Date__c')], map([get(data, 'Apttus_Proposal__RFP_Response_Due_Date__c')], key => get(data, 'total_records')))
        );
      });

    this.quoteService.getGrandTotalByApprovalStage().pipe(take(1))
      .subscribe(totalByStage => {
        this.totalAmount$ = of(get(totalByStage, 'NetPrice', sumBy(totalByStage, 'NetPrice'))),

          this.amountsByStatus$ = of(isArray(totalByStage)
            ? omit(mapValues(groupBy(totalByStage, 'Stage'), s => sumBy(s, 'NetPrice')), 'null')
            : zipObject([get(totalByStage, 'Stage')], map([get(totalByStage, 'Stage')], key => get(totalByStage, 'NetPrice')))
          )
      });
  }
  /** @ignore */
  handleFilterListChange(event: any) {
    this.filterList = event;
    this.loadViewData();
  }

  /**@ignore
   */
  private generateLabels(date): string {
    const today = moment(new Date());
    const dueDate = (date) ? moment(date) : null;
    if (dueDate && dueDate.diff(today, 'days') < this.minDaysFromDueDate) {
      if (!includes(this.colorPalette, 'rgba(208, 2, 27, 1)')) this.colorPalette.push('rgba(208, 2, 27, 1)');
      return '< ' + this.minDaysFromDueDate + ' Days';
    }
    else if (dueDate && dueDate.diff(today, 'days') > this.minDaysFromDueDate && dueDate.diff(today, 'days') < this.maxDaysFromDueDate) {
      if (!includes(this.colorPalette, 'rgba(245, 166, 35, 1)')) this.colorPalette.push('rgba(245, 166, 35, 1)');
      return '< ' + this.maxDaysFromDueDate + ' Days';
    }
    else {
      if (!includes(this.colorPalette, 'rgba(43, 180, 39, 1)')) this.colorPalette.push('rgba(43, 180, 39, 1)');
      return '> ' + this.maxDaysFromDueDate + ' Days';
    }
  }
}
