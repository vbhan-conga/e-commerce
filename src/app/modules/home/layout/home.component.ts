import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Product, Storefront, StorefrontService, CategoryService, ProductService, Category } from '@apttus/ecommerce';
import { first, get, slice, reverse, sortBy, last } from 'lodash';
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

  categories: Array<Category>;

  constructor(private storefrontService: StorefrontService, private categoryService: CategoryService, private productService: ProductService) {
  }

  ngOnInit() {
    this.storefront$ = this.storefrontService.getStorefront();

    this.categoryService.getCategories()
      .pipe(
        take(1)
      ).subscribe(categoryList => {
        this.categories = slice(reverse(sortBy(categoryList, 'ProductCount')), 0, 2);
        this.productListA$ = this.productService.getProducts([first(this.categories).Id], 5, 1).pipe(map(results => get(results, 'Products')));
        this.productListB$ = this.productService.getProducts([last(this.categories).Id], 5, 1).pipe(map(results => get(results, 'Products')));
      });
  }
}