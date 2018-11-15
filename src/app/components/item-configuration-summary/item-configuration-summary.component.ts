import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { CartItem, OrderLineItem, Product, ProductService, Cart, Order, CartItemService, ProductAttributeService, ProductAttributeValue } from '@apttus/ecommerce';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'apt-item-configuration-summary',
  templateUrl: './item-configuration-summary.component.html',
  styleUrls: ['./item-configuration-summary.component.scss']
})
export class ItemConfigurationSummaryComponent implements OnChanges {

  @Input() item: CartItem | OrderLineItem;
  @Input() parent: Cart | Order;
  type: 'Cart' | 'Order' = 'Cart';
  optionList: any;
  attributeList: any;
  selectedProduct: Product;
  productAttributeValue: ProductAttributeValue;

  get optionGroups() {
    return (this.optionList) ? Object.keys(this.optionList) : null;
  }

  get attributeGroups() {
    return (this.attributeList) ? Object.keys(this.attributeList) : null;
  }


  constructor(private productService: ProductService, public sanitizer: DomSanitizer, private cartItemService: CartItemService, private paService: ProductAttributeService) {}

  ngOnChanges() {
    let lineItems = [];
    if (this.parent instanceof Order) {
      this.type = 'Order';
      lineItems = _.get(this.parent, 'OrderLineItems', []);
      this.productService.getProductsByCode([this.item.Product.ProductCode]).take(1).map(res => res[0]).subscribe(p => {
        this.selectedProduct = p;
      });
      this.productAttributeValue = (<OrderLineItem>this.item).DerivedFrom.AttributeValue;
    } else {
      this.type = 'Cart';
      lineItems = _.get(this.parent, 'LineItems', []);
      this.productAttributeValue = (<CartItem> this.item).AttributeValue;
    }

    const options = lineItems.filter(r => r.LineNumber === this.item.PrimaryLineNumber && r.LineType === 'Option');
    this.optionList = _.groupBy(options, 'ProductOption.ProductOptionGroup.OptionGroup.Label');

    this.productService.getProductsByCode([this.item.Product.ProductCode])
      .map(res => res[0])
      .subscribe(product => {
        this.selectedProduct = product;
        this.paService.getProductAttributes(product).subscribe(attributes => {
          this.attributeList = _.groupBy(attributes, 'AttributeGroup.Name');
        });
      });
  }

}
