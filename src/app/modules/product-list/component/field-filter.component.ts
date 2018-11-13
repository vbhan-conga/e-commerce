import { Component, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { ProductService, Product } from '@apttus/ecommerce';
import { ACondition } from '@apttus/core';

@Component({
  selector: 'pl-field-filter',
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{(title) ? title : field?.label}}</h5>
        <apt-input-field [field]="field" (change)="handleChange($event)" [(ngModel)]="data" [label]="false" [allowEmpty]="true"></apt-input-field>
      </div>
    </div>
  `,
  styles: [`
    :host{
      font-size: smaller;
    }
  `]
})
export class FieldFilterComponent implements OnChanges {
  @Input() fieldName: string;
  @Input() title: string;
  @Output() fieldValueChange: EventEmitter<ACondition> = new EventEmitter<ACondition>();

  field: any;
  data: any;
  constructor(private productService: ProductService) { }

  ngOnChanges() {
    this.productService.describe(Product,this.fieldName,null,true).subscribe(
      res => this.field = res,
      err => console.log(err)
    );
  }

  handleChange(evt){
    if(this.field.type === 'boolean'){
      this.data = this.data.toLowerCase() == 'true' ?true: false;
    }
    this.fieldValueChange.emit(new ACondition(Product, this.fieldName, 'Equal', this.data));
  }
}
