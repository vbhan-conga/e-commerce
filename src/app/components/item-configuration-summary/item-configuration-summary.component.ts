import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CartItem, OrderLineItem, Product, ProductService, Cart, Order, CartItemService, ProductAttributeService, ProductAttributeValue, QuoteLineItem, Quote, ProductOptionService, Category, ProductAttributeForm, ProductOptionGroup } from '@apttus/ecommerce';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'apt-item-configuration-summary',
    templateUrl: './item-configuration-summary.component.html',
    styleUrls: ['./item-configuration-summary.component.scss']
})
export class ItemConfigurationSummaryComponent implements OnChanges {

    @Input() item: CartItem | OrderLineItem;
    @Input() parent: Cart | Order | Quote;
    @Input() root: boolean = true;
    @Input() product: Product;
    @Input() optionLineItems: any = [];
    type: 'Cart' | 'Order' = 'Cart';
    optionList: any;
    attributeList: any;
    selectedProduct: Product;
    productAttributeValue: ProductAttributeValue;
    optionGroupList: Array<ProductOptionGroup>;
    attributeFormList: Array<ProductAttributeForm> = new Array<ProductAttributeForm>();

    constructor(private productService: ProductService, public sanitizer: DomSanitizer, private cartItemService: CartItemService, private paService: ProductAttributeService, private poService: ProductOptionService, private cdr: ChangeDetectorRef, private productAttributeService: ProductAttributeService) { }

    ngOnChanges() {
        // Show line item configuration
        if (this.parent) {
            let lineItems = [];
            this.product = (this.root) ? this.item.Product : this.product;
            if (this.parent instanceof Order) {
                this.type = 'Order';
                lineItems = _.get(this.parent, 'OrderLineItems', []);
                this.productService.getProductsByCode([this.item.Product.ProductCode]).take(1).map(res => res[0]).subscribe(p => {
                    this.selectedProduct = p;
                });
                this.optionLineItems = lineItems.filter(r => r.LineNumber === this.item.PrimaryLineNumber && r.LineType === 'Option');
                this.productAttributeValue = (<OrderLineItem>this.item).DerivedFrom.AttributeValue;
            }
            else if (this.parent instanceof Cart) {
                this.type = 'Cart';
                lineItems = _.get(this.parent, 'LineItems', []);
                if (this.root) {
                    this.optionLineItems = lineItems.filter(r => r.LineNumber === this.item.PrimaryLineNumber && r.LineType === 'Option');
                }
                else {
                    this.item = this.optionLineItems.find(item => item.Option.Id === this.product.Id);
                }
                this.productAttributeValue = (<CartItem>this.item).AttributeValue;
            }
            this.getOptionLineItemTree();

            this.productService.getProductsByCode([this.product.ProductCode])
                .map(res => res[0])
                .subscribe(product => {
                    this.selectedProduct = product;
                    this.paService.getProductAttributes(product).subscribe(attributes => {
                        this.selectedProduct.AttributeGroups.forEach(groupMember => {
                            if (this.productAttributeValue) {
                                this.attributeFormList.push({
                                    groupMember: groupMember,
                                    attributeValue: this.productAttributeValue,
                                    productAttributeList: attributes.filter(attr => attr.AttributeGroupId === groupMember.AttributeGroup.Id && !_.isUndefined(this.productAttributeValue[attr['_describe']['label']])),
                                    priceMatrices: null
                                });
                            }
                        });
                        this.cdr.detectChanges();
                    });
                });
        }
        // Show product configuration
        else {
            this.type = null;
            this.getProductOptionTree();
            this.selectedProduct = this.product;
            Observable.combineLatest(
                this.productAttributeService.getProductAttributeDefaults([this.selectedProduct]),
                this.paService.getProductAttributes(this.selectedProduct)
            ).subscribe(([defaults, attributes]) => {
                this.selectedProduct.AttributeGroups.forEach(groupMember => {
                    let productAttibute = _.filter(defaults, item => item.groupMember.Id === groupMember.Id)[0];
                    if (productAttibute) {
                        this.attributeFormList.push({
                            groupMember: groupMember,
                            attributeValue: productAttibute.attributeValue,
                            productAttributeList: attributes.filter(attr => attr.AttributeGroupId === groupMember.AttributeGroup.Id && !_.isUndefined(productAttibute.attributeValue[attr['_describe']['name']])),
                            priceMatrices: null
                        });
                    }
                });

            });
        }
    }

    getOptionLineItemTree() {
        this.poService.getProductOptionTree([this.product.Id]).subscribe(res => {
            this.optionGroupList = res;
            _.flatten(this.optionGroupList.map(category => {
                let categories = _.get(category, '_children');
                if (categories.length > 0) {
                    categories.map(subcategory => {
                        this.filterLineItems(subcategory);
                        if (subcategory['showLabel'])
                            category['showLabel'] = true;
                    });
                }
                else this.filterLineItems(category);
            }));
        });
    }

    filterLineItems(category: ProductOptionGroup) {
        let options = _.get(category, '_metadata.options');
        _.remove(options, (component) => _.find(this.optionLineItems, (lineItem) => lineItem.ProductOption.Id === component.Id) == null);
        category['showLabel'] = options.length > 0;
    }

    getProductOptionTree() {
        this.poService.getProductOptionTree([this.product.Id]).subscribe(res => {
            this.optionGroupList = res;
            _.flatten(this.optionGroupList.map(category => {
                let categories = _.get(category, '_children');
                if (categories.length > 0) {
                    categories.map(subcategory => {
                        this.filterDefaultOptions(subcategory);
                        if (subcategory['showLabel'])
                            category['showLabel'] = true;
                    });
                }
                else this.filterDefaultOptions(category);
            }));
        });
    }

    filterDefaultOptions(category: ProductOptionGroup) {
        let options = _.get(category, '_metadata.options');
        _.remove(options, (component) => !component.Default);
        category['showLabel'] = options.length > 0;
    }

    getOptionQuantity(option): number {
        let quantity = (option.MinQuantity) ? option.MinQuantity : 1;
        return (option.DefaultQuantity) ? option.DefaultQuantity : quantity;
    }

}