import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Category, SearchResults, SearchService, ProductCategory, ProductService } from '@apttus/ecommerce';
import * as _ from 'lodash';
import { ACondition, AJoin } from '@apttus/core';
import { Subscription } from 'rxjs';
import { ConstraintRuleService, ConstraintRule } from '@apttus/constraint-rules';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {

  page = 1;
  pageSize = 12;
  view = 'grid';
  sortField: string;
  /**
   * Value of the product family field filter.
   */
  productFamilyFilter: ACondition;

  conditions: Array<ACondition> = new Array<ACondition>();
  joins: Array<AJoin> = new Array<AJoin>();
  searchString: string = null;
  searchResults: SearchResults;
  searchResultsSubscription: Subscription;
  category: Category;
  constraintRules: Array<ConstraintRule>;

  constructor(private activatedRoute: ActivatedRoute, private searchService: SearchService, private categoryService: CategoryService, private constraintRuleService: ConstraintRuleService, private router: Router, public productService: ProductService) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.searchString = _.get(params, 'query');

      this.categoryService.getCategoryByName(_.get(params, 'categoryName')).subscribe(category => {
        if(category){
          this.category = category;
          this.defaultCategory();
        }else{
          this.getResults();
        }
      });
    });
  }

  defaultCategory(){
    this.categoryService.getCategoryBranchChildren([this.category.Id]).subscribe(categoryList => {
      this.joins = [new AJoin(ProductCategory, 'Id', 'ProductId', [new ACondition(ProductCategory, 'ClassificationId', 'In', categoryList.map(c => c.Id))])];
      this.getResults();
    });
  }

  getResults() {
    this.searchResults = null;
    if(this.searchResultsSubscription)
      this.searchResultsSubscription.unsubscribe();
    this.searchResultsSubscription = this.searchService.searchProducts(this.searchString, this.pageSize, this.page, null, null, this.conditions, this.joins)
      .subscribe(results =>
        this.constraintRuleService.getConstraintRulesForProducts(results.productList, true, true).subscribe(constraintRules => {
          this.constraintRules = constraintRules;
          this.searchResults = results;
        })
      );
  }

  scrollTop() {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(this.scrollTop);
      window.scrollTo(0, c - c / 8);
    }
  }

  onCategory(categoryList: Array<Category>){
    const category = _.get(categoryList, '[0]');
    if(category)
      this.router.navigate(['/product-list', category.Name]);
  }
  onPage(evt) {
    this.page = evt.page;
    this.getResults();
  }

  onPriceTierChange(evt) {
    this.page = 1;
    this.getResults();
  }

  onSubcategoryFilter(categoryList: Array<Category>) {
    _.remove(this.joins, (j) => j.type === ProductCategory);
    this.page = 1;

    if(_.get(categoryList, 'length', 0) > 0){
      this.joins.push(new AJoin(ProductCategory, 'Id', 'ProductId', [new ACondition(ProductCategory, 'ClassificationId', 'In', categoryList.map(category => category.Id))]));
      this.getResults();
    }else
      this.defaultCategory();
  }

  onFilterAdd(condition: ACondition){
    _.remove(this.conditions, (c) => _.isEqual(c, condition));
    this.page = 1;

    this.conditions.push(condition);
    this.getResults();
  }

  onFilterRemove(condition: ACondition){
    _.remove(this.conditions, (c) => _.isEqual(c, condition));
    this.page = 1;
    this.getResults();
  }

  onFieldFilter(evt: ACondition) {
    this.page = 1;
    this.getResults();
  }

  onSortChange(evt) {
    this.page = 1;
    this.sortField = evt;
    this.getResults();
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.getResults();
  }

  handlePicklistChange(event: any) {
    if (this.productFamilyFilter) _.remove(this.conditions, this.productFamilyFilter);
    if (event.length > 0) {
      let values = [];
      event.forEach(item => values.push(item.value));
      this.productFamilyFilter = new ACondition(this.productService.type, 'Family', 'In', values);
      this.conditions.push(this.productFamilyFilter);
    }
    this.getResults();
  }
 
}
