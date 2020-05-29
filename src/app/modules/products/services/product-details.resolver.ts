import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService, ACondition } from '@apttus/core';
import {
  Product,
  CartItem,
  ProductService,
  CartItemService,
  ConstraintRuleService,
  StorefrontService
} from '@apttus/ecommerce';
import { Observable, zip, BehaviorSubject, Subscription } from 'rxjs';
import { take, map, tap, filter } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsResolver implements Resolve<any> {
  private subject: BehaviorSubject<ProductDetailsState> = new BehaviorSubject<ProductDetailsState>(null);

  private subscription: Subscription;

  constructor(private apiService: ApiService,
              private productService: ProductService,
              private cartItemService: CartItemService,
              private crService: ConstraintRuleService,
              private router: Router,
              private http: HttpClient,
              private storefrontService: StorefrontService) { }


  state(): BehaviorSubject<ProductDetailsState> {
    return this.subject;
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ProductDetailsState> {
    const routeParams = route.paramMap;
    if (!_.isNil(this.subscription))
      this.subscription.unsubscribe();
    this.subject.next(null);
    this.subscription = zip(
      this.apiService.get(`/products/${_.get(routeParams, 'params.id')}?cacheStrategy=performance`, Product),
      this.cartItemService.query({
        conditions: [new ACondition(this.cartItemService.type, 'Id', 'In', [_.get(routeParams, 'params.cartItem')])],
        skipCache: true
      }),
      this.crService.getRecommendationsForProducts([_.get(routeParams, 'params.id')]),
      this.storefrontService.isCmsEnabled()
    ).pipe(
      map(([product, cartitemList, rProductList, isCmsEnabled]) => {
        return {
          product: product,
          recommendedProducts: rProductList,
          relatedTo: _.first(cartitemList),
          isCmsEnabled: isCmsEnabled,
          quantity: _.get(_.first(cartitemList), 'Quantity', 1)
        };
      })
    ).subscribe(r => this.subject.next(r));

    return this.subject.pipe(
      filter(s => s != null)
      , tap(state => {
        if (!_.isNil(_.get(routeParams, 'params.cartItem')) && _.isNil(state.relatedTo))
          this.router.navigate(['/products', _.get(state, 'product.Id')]);
      })
      , take(1)
    );
  }
}

/** @ignore */
export interface ProductDetailsState {
    /**
     * The product to display.
     */
    product: Product;
    /**
     * Array of products to act as recommendations.
     */
    recommendedProducts: Array<Product>;
    /**
     * The CartItem related to this product.
     */
    relatedTo: CartItem;
    /**
     * True if CMS Enabled.
     */
    isCmsEnabled: boolean;
    /**
    * Quantity to set to child components
    */
    quantity: number;
}
