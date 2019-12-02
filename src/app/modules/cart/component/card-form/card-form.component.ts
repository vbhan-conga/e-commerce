import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgForm, ControlContainer } from '@angular/forms';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  viewProviders: [{
    provide: ControlContainer,
    useExisting: NgForm
  }]
})
export class CardFormComponent implements OnInit {

  @Input() card: Card;
  @Input() form: NgForm = new NgForm(null, null);

  constructor() { }

  ngOnInit() {
  }

}
/**
 * Special type for holding card information used for the card form component.
 * @ignore
 */
export interface Card {
  /**
   * Name of card holder.
   */
  name: string;
  /**
   * Number on the card.
   */
  number: string;
  /**
   * Expiration year on the card.
   */
  expirationYear: string;
  /**
   * Expiration month on the card.
   */
  expirationMonth: string;
  /**
   * Security code on the card.
   */
  securityCode: string;
}