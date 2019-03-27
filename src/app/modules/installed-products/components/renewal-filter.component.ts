import { Component, Output, EventEmitter } from '@angular/core';
import { ACondition, SimpleDate } from '@apttus/core';
import { AssetLineItem } from '@apttus/abo';
/**
 * Renewal filter component is used to create an asset filter on the period until renewal.
 */
@Component({
  selector: 'app-renewal-filter',
  template: `
    <div class="card animated fadeIn">
      <div class="card-body">
        <form>
          <h5 class="card-title">Days To Renew</h5>
          <ul class="list-unstyled pl-2">
            <li>
              <div class="custom-control custom-radio">
                <input
                  type="radio"
                  id="all"
                  class="custom-control-input"
                  name="renewRadio"
                  value="all"
                  (change)="handleCheckChange($event)"
                  checked
                >
                <label class="custom-control-label" for="all">
                  All
                </label>
              </div>
            </li>
            <li>
              <div class="custom-control custom-radio">
                <input
                  type="radio"
                  id="less30"
                  class="custom-control-input"
                  name="renewRadio"
                  value="less30"
                  (change)="handleCheckChange($event)"
                >
                <label class="custom-control-label" for="less30">
                  < 30 Days
                </label>
              </div>
            </li>
            <li>
              <div class="custom-control custom-radio">
                <input
                  type="radio"
                  id="30-60"
                  class="custom-control-input"
                  name="renewRadio"
                  value="30-60"
                  (change)="handleCheckChange($event)"
                >
                  <label class="custom-control-label" for="30-60">
                  < 60 Days
                </label>
              </div>
            </li>
            <li>
              <div class="custom-control custom-radio">
                <input
                  type="radio"
                  id="60-90"
                  class="custom-control-input"
                  name="renewRadio"
                  value="60-90"
                  (change)="handleCheckChange($event)"
                >
                <label class="custom-control-label" for="60-90">
                  < 90 Days
                </label>
              </div>
            </li>
            <li>
              <div class="custom-control custom-radio">
                <input
                  type="radio"
                  id="more90"
                  class="custom-control-input"
                  name="renewRadio"
                  value="more90"
                  (change)="handleCheckChange($event)"
                >
                <label class="custom-control-label" for="more90">
                  > 90 Days
                </label>
              </div>
            </li>
          </ul>
        </form>
      </div>
    </div>
  `,
  styles: [`
    li {
      font-size: smaller;
      line-height: 24px;
    }
  `]
})
export class RenewalFilterComponent {
  /**
   * Map of checkbox values to AConditions used for the event emitter.
   */
  private eventMap = {
    'all': new ACondition(AssetLineItem, 'Id', 'NotEqual', null),
    'less30': new ACondition(AssetLineItem, 'EndDate', 'LessEqual', this.dateGetter(30)),
    '30-60': new ACondition(AssetLineItem, 'EndDate', 'LessEqual', this.dateGetter(60)),
    '60-90': new ACondition(AssetLineItem, 'EndDate', 'LessEqual', this.dateGetter(90)),
    'more90': new ACondition(AssetLineItem, 'EndDate', 'GreaterThan', this.dateGetter(90))
  };
  /**
   * Event emitter for the current value of this control.
   */
  @Output() value: EventEmitter<ACondition> = new EventEmitter<ACondition>();
  /**
   * Gets SimpleDate objects with the value set to today plus the given number of days.
   * @param days Number of days from today to get date.
   */
  private dateGetter(days: number): SimpleDate {
    let today = new Date();
    let date = new SimpleDate();
    today.setDate(today.getDate() + days);
    date.setDate(today);
    return date;
  }
  /**
   * Event handler for when the checkbox value changes.
   * @param event Event that was fired.
   */
  handleCheckChange(event: any) {
    this.value.emit(this.eventMap[event.target.value]);
  }

}
