import { Component, OnInit, ViewChild, TemplateRef, HostListener, NgZone  } from '@angular/core';
import {
  ProductService, Product, ProductOptionService, ProductOptionComponent, ProductAttributeService,
  ProductAttribute, ProductOptionForm, ProductAttributeMap, ConstraintRuleService, CartService,
  Cart, ConstraintRuleAction, ConstraintRule, CartProductForm, ProductAttributeValue, PriceListItemService} from '@apttus/ecommerce';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as _ from 'lodash';
import { ACondition } from '@apttus/core';

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
  validationMessage: string;
  modalRef: BsModalRef;

  cart$: Observable<Cart>;

  get productAttributeValueList(): Array<ProductAttributeValue>{
    return this.productAttributeMap.map(p => p.attributeValue);
  }

  constructor(public productService: ProductService,
                  private route: ActivatedRoute,
                  private productOptionService: ProductOptionService,
                  private productAttributeService: ProductAttributeService,
                  private constraintRuleService: ConstraintRuleService,
                  private modalService: BsModalService,
                  private cartService: CartService,
                  public ngZone: NgZone) {
  }

  ngOnInit() {
    this.cart$ = this.cartService.getMyCart();
    this.route.params
      .filter(params => params['productCode'] != null)
      .map(params => params['productCode'])
      // .flatMap(productCode => this.productService.where(this.productService.config.productIdentifier + ` = {0}`, productCode))
      .flatMap(productCode => this.productService.where([new ACondition(this.productService.type, this.productService.config.productIdentifier, 'Equal', productCode)]))
      .map(res => res[0])
      .filter(product => product != null)
      .distinctUntilKeyChanged('Id')
      .subscribe(p => this.onProductLoad(p));
  }

  onProductLoad(product: Product){
    Observable.combineLatest(
      Observable.if(
        () => (product.HasAttributes && _.get(product, 'AttributeGroups.length', 0) > 0),
        this.productAttributeService.getProductAttributes(product),
        Observable.of(null)),
      Observable.if(
        () => (product.HasOptions && product.OptionGroups && _.get(product, 'OptionGroups.length', 0) > 0),
        this.productOptionService.getProductOptions(product.ProductCode, null, true),
        Observable.of(null)
      ),
      this.constraintRuleService.getConstraintRules(product)
    ).subscribe(([attributes, options, rules]) => {
      if(options){

        // Set the default options
        this.productOptionList = options.filter(option => option.Default === true).map(option => {
          let quantity = (option.MinQuantity) ? option.MinQuantity : 1;
          if(option.DefaultQuantity)
            quantity = option.DefaultQuantity;
          return {
            productOptionComponent: option,
            quantity: quantity,
            attributeValues: null
          } as ProductOptionForm;
        });

        product.OptionGroups.forEach(group => {
          const groupOptions = options.filter(option => option.ProductOptionGroupId === group.Id);

          // Assign the queried options to the option groups
          group.Options = groupOptions;
          group._metadata = {
            hasRequired: groupOptions.filter(option => option.Required === true).length > 0
          };
        });
      }
        if (attributes)
          this.productAttributeList = attributes;
          
        this.ngZone.run(() => {
          this.product = product;
          if(rules){
            this.constraintRules = rules;
            this.hasReplacements = _.flatten(rules.map(r => r.ConstraintRuleActions.filter(a => a.ActionType === 'Replacement'))).length > 0;
          }
        });
    });
  }

  addToCart(){
    this.loading = true;
    const adt = this.additionalProducts.map(p => {return {
      productCode: p.ProductCode,
      quantity : 1
    } as CartProductForm;});
    Observable.combineLatest(
      this.cartService.addProductToCart(this.product, 1, false, this.productAttributeMap.map(p => p.attributeValue), this.productOptionList),
      this.cartService.bulkAddProductToCart(adt)
    ).subscribe(
      r => {
        this.loading = false;
      },
      e => {this.loading = false;}
    );
  }

  confirm(): void {
    this.addToCart();
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }

  validate(): void{
    const validationRules = _.flatten(this.constraintRules.map(r => r.ConstraintRuleActions.filter(a => a.ActionType === 'Validation')));
    const recommendationRules = _.flatten(this.constraintRules.map(r => r.ConstraintRuleActions.filter(a => a.ActionType === 'Recommendation' && a.ActionIntent === 'Show Message')));
    const matchingRules = validationRules.filter(action => this.additionalProducts.filter(product => this.isMatchingAction(product, action)).length > 0);
    const matchingRecommendations = this.hasRecommendation(recommendationRules);

    if(matchingRules.length > 0){
      this.validationMessage = matchingRules[0].Message;
      this.modalRef = this.modalService.show(this.confirmDialog);
    }else if(matchingRecommendations.length > 0){
      this.validationMessage = this.format(matchingRecommendations[0].Message, [this.product.Name, matchingRecommendations[0].Product.Name]);
      this.modalRef = this.modalService.show(this.confirmDialog);
    }
    else{
      this.addToCart();
    }
  }

  private isMatchingAction(product: Product, action: ConstraintRuleAction): boolean{
    let valid = true;
    if (action.ProductScope === 'Product Group' && _.get(product, 'ProductGroups', []).filter(group => group.ProductGroupId === action.ProductGroupId).length > 0)
      valid = (valid && true);
    else if (action.ProductScope === 'Product' && product.Id === action.Product.Id)
      valid = (valid && true);
    else if (action.ProductScope === 'Product Family' && product.Family === action.ProductFamily)
      valid = (valid && true);
    else
      valid = false;
    return valid;
  }

  private hasRecommendation(recommendationRules: Array<ConstraintRuleAction>): Array<ConstraintRuleAction>{
    const validRules = [];
    recommendationRules.forEach(r => {
      const product = this.additionalProducts.filter(p => p.Id === r.Product.Id);
      if(!product || product.length === 0)
        validRules.push(r);
    });
    return validRules;
  }

  private format(str: string, args){
    return str.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] !== 'undefined'
        ? args[number]
        : match
        ;
    });
  }
}
