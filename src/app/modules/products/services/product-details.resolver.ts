import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import {
  Product,
  CartItem,
  ProductService,
  CartItemService,
  ConstraintRuleService,
  CmsService
} from '@apttus/ecommerce';
import { Observable, zip, BehaviorSubject, Subscription } from 'rxjs';
import { take, map, tap, filter } from 'rxjs/operators';
import { ACondition } from '@apttus/core';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class ProductDetailsResolver implements Resolve<any> {
    constructor(private productService: ProductService,
                private cartItemService: CartItemService,
                private crService: ConstraintRuleService,
                private router: Router,
                private cmsService: CmsService) { }

    private subject: BehaviorSubject<ProductDetailsState> = new BehaviorSubject<ProductDetailsState>(null);
    private subscription: Subscription;

    state(): BehaviorSubject<ProductDetailsState> {
        return this.subject;
    }

    resolve(route: ActivatedRouteSnapshot): Observable<ProductDetailsState> {
        const routeParams = route.paramMap;
        if (!_.isNil(this.subscription))
            this.subscription.unsubscribe();
        this.subject.next(null);
        this.subscription = zip(
            this.productService.get([_.get(routeParams, 'params.id')]),
            this.cartItemService.query({
                conditions: [new ACondition(CartItem, 'Id', 'In', [_.get(routeParams, 'params.cartItem')])],
                skipCache: true
            }),
            this.crService.getRecommendationsForProducts([_.get(routeParams, 'params.id')]),
            this.cmsService.isCmsEnabled(),
        ).pipe(
            map(([productList, cartitemList, rProductList, isCmsEnabled]) => {
                return {
                    product: _.first(productList),
                    recommendedProducts: rProductList,
                    relatedTo: _.first(cartitemList),
                    isCmsEnabled: isCmsEnabled
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

/**
 * View object type for the product details page.
 * @ignore
 */
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
}
