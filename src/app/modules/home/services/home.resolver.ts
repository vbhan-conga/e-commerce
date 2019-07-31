/**
 * Apttus Digital Commerce
 *
 * The home resolver service provides the state for the home page as an observable
 */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Product, Storefront, StorefrontService, CategoryService, ProductService, Category } from '@apttus/ecommerce';
import { Observable, combineLatest, of } from 'rxjs';
import { mergeMap, map, take } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class HomeResolver implements Resolve<any> {
    constructor(private storefrontService: StorefrontService, private categoryService: CategoryService, private productService: ProductService) {}

    /**
     * @description primary method which builds the state for the home page
     * @returns an Observable of type HomeState
     */
    state(): Observable<HomeState>{
        return combineLatest(
            this.storefrontService.getStorefront()
            ,this.categoryService.getCategories()
            .pipe(
                mergeMap(categoryList => {
                    // Method sorts the category list by product count and reverses it to get the 2 categories with the most products.
                    const categories = _.slice(_.reverse(_.sortBy(categoryList, 'ProductCount')), 0, 2);
                    return combineLatest(
                        this.productService.getProductsByCategory(_.first(categories).Id, 5, 0),
                        this.productService.getProductsByCategory(_.last(categories).Id, 5, 0),
                        of(categories)
                    );
                })
            )
        ).pipe(
            map(([storefront, [productListA, productListB, categoryList]]) => {
                return {
                    productListA: productListA,
                    productListB: productListB,
                    storefront: storefront,
                    categories: categoryList
                };
            })
        );
    }

    resolve(route: ActivatedRouteSnapshot): Observable<HomeState> {
        return this.state().pipe(take(1));
    }
}

/**
 * Interface structure for the home page
 */
export interface HomeState{
    // The array of products for the first carousel
    productListA: Array<Product>;

    // The array of products for the second carousel
    productListB: Array<Product>;

    // The reference to the storefront record
    storefront: Storefront;

    // The list of categories to use for the product carousels
    categories: Array<Category>;
}