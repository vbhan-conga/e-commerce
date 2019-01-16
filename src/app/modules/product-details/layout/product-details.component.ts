import { Component, OnInit, ChangeDetectorRef,Output, EventEmitter } from '@angular/core';
import { ProductService, Product, PriceMatrixService, PriceMatrixEntry } from '@apttus/ecommerce';
import { ConstraintRule, ConstraintRuleService } from '@apttus/constraint-rules';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ACondition, ConfigurationService } from '@apttus/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product;
  rules: Array<ConstraintRule>;
  relatedProducts$: Observable<Array<Product>>;
  similarProducts$: Observable<Array<Product>>;

  replacementProducts$: Observable<Array<Product>>;
  recommendedProducts$: Observable<Array<Product>>;
  replacementRules: Array<any>;
  volumeDiscounts: Array<PriceMatrixEntry>;
  bannerType: Array<any>;

  @Output() validationObj= new EventEmitter<any>();


  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private cdr: ChangeDetectorRef,
              private priceMatrixService: PriceMatrixService,
              private constraintRuleService: ConstraintRuleService,
              private config: ConfigurationService) { }

  ngOnInit() {
    this.route.params
      .filter(params => params['productCode'] != null)
      .map(params => params['productCode'])
      .flatMap(productCode => {
        this.product = null;
        this.rules = null;
        this.replacementRules = null;
        return this.productService.where([new ACondition(Product, this.config.get('productIdentifier'), 'Equal', productCode)]);
      })
      .map(res => res[0])
      .filter(product => product != null)
      .subscribe(product => this.onProductLoad(product));
  }


  onProductLoad(product: Product){
    this.relatedProducts$ = null;
    this.replacementProducts$ = null;
    this.recommendedProducts$ = null;
    this.replacementRules = null;
    this.volumeDiscounts = null;

    this.product = product;
    this.relatedProducts$ = this.productService.getProductsByCategory(_.get(product, 'Categories[0].ClassificationId.AncestorId'));
    this.similarProducts$ = this.productService.getProductsByCategory(_.get(product, 'Categories[0].ClassificationId.PrimordialId'));

    this.constraintRuleService.getConstraintRulesForProducts([product]).take(1).subscribe(rules => {
      this.rules = rules;
      this.validationObj = _.flatten(rules.map(r => r.ConstraintRuleActions.filter(a => a.ActionIntent === 'Show Message')));
      this.replacementRules = _.flatten(rules.map(r => r.ConstraintRuleActions.filter(a => a.ActionType === 'Replacement')));
      if(this.replacementRules.length > 0)
        this.replacementProducts$ = this.productService.get(this.replacementRules.map(p => p.ProductId));
    });

    this.recommendedProducts$ = this.constraintRuleService.getRecommendationsForProducts([this.product]);
    this.priceMatrixService.getPriceMatrixData([this.product.PriceLists[0]]).subscribe(r => {
      r.forEach(matrix => {
        let hasQuantityRule = false;
        for(let i = 1; i<= 6; i++){
          hasQuantityRule = (_.get(matrix, 'Dimension' + i + '.Type') === 'Quantity') ? true : hasQuantityRule;
        }
        if(hasQuantityRule)
          this.volumeDiscounts = matrix.MatrixEntries;
      });
    });
    // this.recommendedProducts$ = this.constraintRuleService.getProductsForContstraintRuleCondition(_.get(product, 'Apttus_Config2__ConstraintRuleConditions__r.records'), 'Recommendation');
    // this.includedProducts$ = this.constraintRuleService.getProductsForContstraintRuleCondition(_.get(product, 'Apttus_Config2__ConstraintRuleConditions__r.records'), 'Inclusion');
  }

  changeTab($evt){
    this.cdr.detectChanges();
  }

}
