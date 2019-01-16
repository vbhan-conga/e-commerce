import { Component, Input, EventEmitter, Output, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { CartItemService, CartItem } from '@apttus/ecommerce';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as _ from 'lodash';
import * as moment from 'moment';

/**
 * Date Range Component
 *
 * The date range component includes two date input fields one for start date and one for end date. The input fields use the ngx-bootstrap date picker component.
 *
 * By default the date range component will calculate the begining and ending date for the cart item that is passed to it based on the frequency and term of the product.
 * When the user selects a date in the start date or end date inputs the onStartDateChange and onEndDateChange methods will be fired respectively.
 *
 * Example Usage:
 * @example
 * <apt-date-range-input
 *    (onStartDateChange)="handleStartChange($event, item)"
 *    (onEndDateChange)="handleEndDateChange($event, item)"
 *    [cartItem]="item"
 * ></apt-date-range-input>
 */
@Component({
  selector: 'apt-date-range-input',
  templateUrl: './date-range-input.component.html',
  styleUrls: ['./date-range-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangeInputComponent implements OnChanges {
  /**
   * The cart item associated with the date range picker.
   */
  @Input() cartItem: CartItem;
  /**
   * Event emitter that fires when start date input is changed.
   */
  @Output() onStartDateChange: EventEmitter<any> = new EventEmitter();
  /**
   * Event emitter that fires when the end date input is changed.
   */
  @Output() onEndDateChange: EventEmitter<any> = new EventEmitter();


  startDate: Date = new Date();
  endDate: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private cartItemService: CartItemService) {
    this.bsConfig = Object.assign({}, {
      showWeekNumbers: false,
      dateInputFormat: 'MM/DD/YYYY'
    });
  }

  ngOnChanges() {
    this.startDate = moment(_.get(this.cartItem, 'StartDate', new Date().toISOString().split('T')[0]), 'YYYY-MM-DD').toDate();
    this.endDate = moment(_.get(this.cartItem, 'EndDate',
      this.cartItemService.getEndDate(this.startDate, _.get(this.cartItem, 'PriceListItem.DefaultSellingTerm', 1), this.cartItem.PriceListItem.Frequency).getTime()
    )).toDate();

    // Assign values to cart
    this.cartItem.StartDate = moment(this.startDate).format('YYYY-MM-DD');
    this.cartItem.EndDate = moment(this.endDate).format('YYYY-MM-DD');
  }

  /**
   * Called when user changes the start date input.
   * @param event The date object from the start date input.
   */
  startDateChange(event: Date) {
      const startDate = moment(event);
      this.cartItem.StartDate = startDate.format('YYYY-MM-DD');
      this.cartItem.SellingTerm = this.cartItemService.getTerm(moment(this.cartItem.StartDate, 'YYYY-MM-DD'), moment(this.cartItem.EndDate, 'YYYY-MM-DD'), this.cartItem.PriceListItem.Frequency);
      this.onStartDateChange.emit();
  }
  /**
   * Called when user changes the end date input.
   * @param event The date object from the end date input.
   */
  endDateChange(event: Date) {
    const endDate = moment(event);
    this.cartItem.EndDate = endDate.format('YYYY-MM-DD');
    this.cartItem.SellingTerm = this.cartItemService.getTerm(moment(this.cartItem.StartDate, 'YYYY-MM-DD'), moment(this.cartItem.EndDate, 'YYYY-MM-DD'), this.cartItem.PriceListItem.Frequency);
    this.onEndDateChange.emit();
  }
}
