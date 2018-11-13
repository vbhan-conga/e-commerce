import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CardFormComponent implements OnInit {

  @Input() card: Card;
  @Input() form: NgForm = new NgForm(null, null);

  constructor() { }

  ngOnInit() {
  }

}

export interface Card {
  name: string;
  number: string;
  expirationYear: string;
  expirationMonth: string;
  securityCode: string;
}