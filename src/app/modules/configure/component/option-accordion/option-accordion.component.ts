import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Product, ProductOptionForm, ProductOptionComponent, ProductCarouselComponent } from '@apttus/ecommerce';

@Component({
  selector: 'app-option-accordion',
  templateUrl: './option-accordion.component.html',
  styleUrls: ['./option-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionAccordionComponent{
  @Input() product: Product;
  @Input() productOptionList: Array<ProductOptionForm> = new Array<ProductOptionForm>();

  slideConfigRequired = ProductCarouselComponent.getConfig(4, false, true, false, true);
  slideConfig = ProductCarouselComponent.getConfig(5, false, true, false, true);

  constructor() { }

  toggleComponent(component: ProductOptionComponent) {
    if (this.selected(component))
      this.removeComponent(component);
    else{
      if (component.ProductOptionGroup.MaxOptions === 1) {
        this.productOptionList.filter(option => option.productOptionComponent.ProductOptionGroup.Id === component.ProductOptionGroup.Id).forEach(option => this.removeComponent(option.productOptionComponent));
        this.productOptionList.push(this.getOptionForm(component));
      }
      else {
        this.productOptionList.push(this.getOptionForm(component));
      }
    }
  }

  removeComponent(component){
    this.productOptionList.forEach((option, index) => {
      if (option.productOptionComponent.Id === component.Id)
        this.productOptionList.splice(index, 1);
    });
  }

  selected(component: ProductOptionComponent) {
    const existing = this.productOptionList.filter(option => option.productOptionComponent.Id === component.Id)[0];
    return (existing != null);
  }

  getOptionForm(component: ProductOptionComponent): ProductOptionForm{
    const ret = this.productOptionList.filter(option => option.productOptionComponent.Id === component.Id)[0];
    const quantity = (component.MinQuantity) ? component.MinQuantity : 1;
    return (ret) ? ret : {quantity: quantity, productOptionComponent : component, attributeValues : null};
  }

}
