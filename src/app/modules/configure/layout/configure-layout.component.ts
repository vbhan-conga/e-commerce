import { Component, OnInit, ViewChild, TemplateRef, HostListener, NgZone } from '@angular/core';
import {
  ProductService, Product, ProductOptionService, ProductAttributeService, Cart,
  ProductAttribute, ProductOptionForm, ProductAttributeMap, CartService, CartItem, ProductAttributeValue
} from '@apttus/ecommerce';
import { ConstraintRuleService, ConstraintRuleAction, ConstraintRule } from '@apttus/constraint-rules';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as _ from 'lodash';
import { ACondition } from '@apttus/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-configure-layout',
  templateUrl: './configure-layout.component.html',
  styleUrls: ['./configure-layout.component.scss']
})
export class ConfigureLayoutComponent implements OnInit {
  @ViewChild('confirmDialog') confirmDialog: TemplateRef<any>;

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.fixedHeader = window.pageYOffset >= 88;
  }

  fixedHeader: boolean = false;
  constraintRules$: Observable<Array<ConstraintRule>>;
  hasReplacements: boolean = false;

  product: Product;
  productAttributeList: Array<ProductAttribute>;
  productOptionList: Array<ProductOptionForm> = new Array<ProductOptionForm>();
  productAttributeMap: Array<ProductAttributeMap> = new Array<ProductAttributeMap>();
  additionalProducts: Array<Product> = new Array<Product>();
  constraintRules: Array<ConstraintRule> = new Array<ConstraintRule>();

  loading: boolean = false;
  modalRef: BsModalRef;

  cart$: Observable<Cart>;
  cartItemId: string;
  cartItem: CartItem;

  get productAttributeValueList(): Array<ProductAttributeValue> {
    return this.productAttributeMap.map(p => p.attributeValue);
  }

  constructor(public productService: ProductService,
    private route: ActivatedRoute,
    private productOptionService: ProductOptionService,
    private productAttributeService: ProductAttributeService,
    private constraintRuleService: ConstraintRuleService,
    private cartService: CartService,
    private toastr: ToastrService,
    public ngZone: NgZone) {
  }

  ngOnInit() {
    this.cart$ = this.cartService.getMyCart();
    this.route.params
      .filter(params => params['productCode'] != null)
      .map(params => [params['productCode'], params['cartItemId']])
      .flatMap(([productCode, cartItemId]) => {
        this.cartItemId = cartItemId;
        return this.productService.where([new ACondition(this.productService.type, this.productService.config.productIdentifier, 'Equal', productCode)]);
      })
      .map(res => res[0])
      .filter(product => product != null)
      .distinctUntilKeyChanged('Id')
      .subscribe(p => this.onProductLoad(p));
  }

  onProductLoad(product: Product) {
    Observable.combineLatest(
      Observable.if(
        () => (product.HasAttributes && _.get(product, 'AttributeGroups.length', 0) > 0),
        this.productAttributeService.getProductAttributes(product),
        Observable.of(null))
      , Observable.if(
        () => (product.HasOptions && product.OptionGroups && _.get(product, 'OptionGroups.length', 0) > 0),
        this.productOptionService.getProductOptions(product.ProductCode, null, true),
        Observable.of(null)
      )
      , this.constraintRuleService.getConstraintRulesForProducts([product])
      , this.cart$.take(1)
    ).subscribe(([attributes, options, rules, cart]) => {

      if (options) {

        // Set the default options if not in edit mode
        if (!this.cartItemId) {
          this.productOptionList = options.filter(option => option.Default === true).map(option => {
            let quantity = (option.MinQuantity) ? option.MinQuantity : 1;
            return {
              productOptionComponent: option,
              quantity: (option.DefaultQuantity) ? option.DefaultQuantity : quantity,
              attributeValues: null
            } as ProductOptionForm;
          });
        }
        else {
          this.cartItem = _.find(cart.LineItems, { Id: this.cartItemId });
          const optionLineItems = cart.LineItems.filter(lineItem => lineItem.LineType === 'Option' && lineItem.ParentBundleNumber === this.cartItem.LineNumber);
          this.productOptionList = optionLineItems.map(lineItem => {
            return {
              productOptionComponent: _.find(options, {Id: lineItem.ProductOption.Id}),
              quantity: lineItem.Quantity,
              attributeValues: null
            };
          });
        }

        product.OptionGroups.forEach(group => {
          const groupOptions = options.filter(option => option.ProductOptionGroupId === group.Id);

          // Assign the queried options to the option groups
          group.Options = groupOptions;
          _.set(group, '_metadata.hasRequired', groupOptions.filter(option => option.Required === true).length > 0);
        });
      }
      if (attributes)
        this.productAttributeList = attributes;

      this.ngZone.run(() => {
        this.product = product;
        if (rules) {
          this.constraintRules = rules;
          this.hasReplacements = _.flatten(rules.map(r => r.ConstraintRuleActions.filter(a => a.ActionType === 'Replacement'))).length > 0;
        }
      });
    });
  }

  addToCart() {
    this.loading = true;
    this.cartService.addProductToCart(this.product, 1, false, this.productAttributeMap.map(p => p.attributeValue), this.productOptionList)
    .subscribe(
      r => {
        this.loading = false;
      },
      e => { this.loading = false; }
    );
  }

  saveConfiguration(){
    this.loading = true;
    this.cartService.updateOptionsOnCartItem(this.cartItem, this.productOptionList).subscribe(() => {
      this.loading = false;
      this.toastr.success('The configuration has been saved.', 'Save Success');
    }, () => {
      this.toastr.error('There was a problem saving this configuration.', 'Save Error');
      this.loading = false;
    });
  }
}
