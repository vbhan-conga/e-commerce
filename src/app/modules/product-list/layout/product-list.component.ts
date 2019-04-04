import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Category, SearchResults, SearchService, ProductCategory, ProductService } from '@apttus/ecommerce';
import * as _ from 'lodash';
import { ACondition, AJoin } from '@apttus/core';
import { Subscription } from 'rxjs';
import { ConstraintRuleService, ConstraintRule } from '@apttus/constraint-rules';

/**
 * Product list component shows all the products in a list for user selection.
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {

  /**
   * Current page used by the pagination component. Default is 1.
   */
  page = 1;
  /**
   * Number of records per page used by the pagination component. Default is 12.
   */
  pageSize = 12;
  /**
   * Layout in which one wants to see products. Grid/list. Default is Grid.
   */
  view = 'grid';
  /**
   * A field name on which one wants to apply sorting.
   */
  sortField: string;
  /**
   * Value of the product family field filter.
   */
  productFamilyFilter: ACondition;
  /**
   * Condition to filter products from all products.
   */
  conditions: Array<ACondition> = new Array<ACondition>();
  joins: Array<AJoin> = new Array<AJoin>();
  /**
   * Search query to filter products list from grid.
   */
  searchString: string = null;
  searchResults: SearchResults;
  searchResultsSubscription: Subscription;
  category: Category;
  constraintRules: Array<ConstraintRule>;

  /** 
   * @ignore
   */
  constructor(private activatedRoute: ActivatedRoute, private searchService: SearchService, private categoryService: CategoryService, private constraintRuleService: ConstraintRuleService, private router: Router, public productService: ProductService) {}

  /** 
   * @ignore
   */
  ngOnDestroy() {}

  /** 
   * @ignore
   */
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

  /** 
   * @ignore
   */
  defaultCategory(){
    this.categoryService.getCategoryBranchChildren([this.category.Id]).subscribe(categoryList => {
      this.joins = [new AJoin(ProductCategory, 'Id', 'ProductId', [new ACondition(ProductCategory, 'ClassificationId', 'In', categoryList.map(c => c.Id))])];
      this.getResults();
    });
  }

  /** 
   * @ignore
   */
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

  /**
   * This function helps at UI to scroll at the top of the product list.
   */
  scrollTop() {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(this.scrollTop);
      window.scrollTo(0, c - c / 8);
    }
  }

  /**
   * Filters peers Category from the categorylist.
   * @param categoryList Array of Category.
   */
  onCategory(categoryList: Array<Category>){
    const category = _.get(categoryList, '[0]');
    if(category)
      this.router.navigate(['/product-list', category.Name]);
  }

  /**
   * Event handler for the pagination component when the page is changed.
   * @param evt Event object that was fired.
   */
  onPage(evt) {
    this.page = evt.page;
    this.getResults();
  }

  /** 
   * @ignore
   */
  onPriceTierChange(evt) {
    this.page = 1;
    this.getResults();
  }

  /**
   * Filters child category from the categorylist.
   * @param categoryList Array of Category.
   */
  onSubcategoryFilter(categoryList: Array<Category>) {
    _.remove(this.joins, (j) => j.type === ProductCategory);
    this.page = 1;

    if(_.get(categoryList, 'length', 0) > 0){
      this.joins.push(new AJoin(ProductCategory, 'Id', 'ProductId', [new ACondition(ProductCategory, 'ClassificationId', 'In', categoryList.map(category => category.Id))]));
      this.getResults();
    }else
      this.defaultCategory();
  }

  /**
   * This function is called when adding saerch filter criteria to product grid.
   * @param condition Search filter query to filter products.
   */
  onFilterAdd(condition: ACondition){
    _.remove(this.conditions, (c) => _.isEqual(c, condition));
    this.page = 1;

    this.conditions.push(condition);
    this.getResults();
  }

  /**
   * This function is called when removing saerch filter criteria to product grid.
   * @param condition Search filter query to remove from products grid.
   */
  onFilterRemove(condition: ACondition){
    _.remove(this.conditions, (c) => _.isEqual(c, condition));
    this.page = 1;
    this.getResults();
  }

  /** 
   * @ignore
   */
  onFieldFilter(evt: ACondition) {
    this.page = 1;
    this.getResults();
  }

  /**
   * Fired when sorting is changed on products grid.
   * @param evt Event object that was fired.
   */
  onSortChange(evt) {
    this.page = 1;
    this.sortField = evt;
    this.getResults();
  }

  /**
   * Fired when page size is changed for products grid.
   * @param event Event object that was fired.
   */
  onPageSizeChange(event) {
    this.pageSize = event;
    this.getResults();
  }

  /**
   * Filter on products grid forby product family.
   * @param event Event Object that was fired.
   */
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
