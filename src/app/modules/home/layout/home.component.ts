import { Component, OnInit } from '@angular/core';
import { StorefrontService, Storefront, CategoryService, Category, Product, ProductService } from '@apttus/ecommerce';

import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

/**
 * Default Home/Landing componenet for Apttus Digital Commerce.
 * Shows Storefront image(s), products from first two categories of price list and Footer
 * 
 * @example
 * <app-home></app-home>
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /**
   * Stores all the details about current storefront object
   */
  storefront$: Observable<Storefront>;
  /**
   * To show products from price list's first category 
   */
  productListA$: Observable<Array<Product>>;
  /**
   * To show products from price list's second category 
   */
  productListB$: Observable<Array<Product>>;
  /**
   * Stores category tree for price list
   */
  categories: Array<Category>;

  constructor(private storefrontService: StorefrontService,
              private categoryService: CategoryService,
              public sanitizer:DomSanitizer,
              private productService: ProductService) {}

  ngOnInit() {
    this.storefront$ = this.storefrontService.getStorefront();

    this.categoryService.getCategoryTree().subscribe(categories => {
      this.categories = [categories[0], categories[1]];
      this.productListA$ = this.productService.getProductsByCategory(categories[0].Id, 5, 0);
      this.productListB$ = this.productService.getProductsByCategory(categories[1].Id, 5, 0);
    });
  }

}
