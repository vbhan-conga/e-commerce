import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Product, Storefront, StorefrontService, CategoryService, ProductService, Category } from '@apttus/ecommerce';
import * as _ from 'lodash';

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

  storefront$: Observable<Storefront>;

  productListA$: Observable<Array<Product>>;

  productListB$: Observable<Array<Product>>;

  categories$: Observable<Array<Category>>;

  constructor(private storefrontService: StorefrontService, private categoryService: CategoryService, private productService: ProductService) {
  }

  ngOnInit() {
    this.storefront$ = this.storefrontService.getStorefront();
    this.categories$ = this.categoryService.getCategories()
      .pipe(
        map(categoryList => {
          // Method sorts the category list by product count and reverses it to get the 2 categories with the most products.
          const categories = _.slice(_.reverse(_.sortBy(categoryList, 'ProductCount')), 0, 2);
          this.productListA$ = this.productService.getProductsByCategory(_.first(categories).Id, 5, 0).pipe(map(r => r.Products));
          this.productListB$ = this.productService.getProductsByCategory(_.last(categories).Id, 5, 0).pipe(map(r => r.Products));
          return categories;
        }));
  }
}