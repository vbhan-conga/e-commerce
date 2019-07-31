import { Injectable } from '@angular/core';
import { Resolve, ParamMap, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Product, CartItem, ProductService, CartItemService, ConstraintRuleService } from '@apttus/ecommerce';
import { Observable, combineLatest, zip, BehaviorSubject, Subscription } from 'rxjs';
import { take, map, tap, filter } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class ProductDetailsResolver implements Resolve<any> {
    constructor(private productService: ProductService, private cartItemService: CartItemService, private crService: ConstraintRuleService, private router: Router) {}

    private subject: BehaviorSubject<ProductDetailsState> = new BehaviorSubject<ProductDetailsState>(null);
    private subscription: Subscription;

    state(): BehaviorSubject<ProductDetailsState> {
        return this.subject;
    }

    resolve(route: ActivatedRouteSnapshot): Observable<ProductDetailsState> {
        const routeParams = route.paramMap;
        if(!_.isNil(this.subscription))
            this.subscription.unsubscribe();
        this.subject.next(null);
        this.subscription  = zip(
            this.productService.get([_.get(routeParams, 'params.productCode')]),
            this.cartItemService.get([_.get(routeParams, 'params.cartItemId')]),
            this.crService.getRecommendationsForProducts([_.get(routeParams, 'params.productCode')])
        ).pipe(
            map(([productList, cartitemList, rProductList]) => {
                return {
                    product: _.first(productList),
                    recommendedProducts: rProductList,
                    relatedTo: _.first(cartitemList)
                };
            })
        ).subscribe(r => this.subject.next(r));

        return this.subject.pipe(
            filter(s => s != null)
            ,tap(state => {
                if(!_.isNil(_.get(routeParams, 'params.cartItemId')) && _.isNil(state.relatedTo))
                    this.router.navigate(['/product', _.get(state, 'product.Id')])
            })
            ,take(1)
        );
    }
}

export interface ProductDetailsState {
    product: Product;
    recommendedProducts: Array<Product>;
    relatedTo: CartItem;
}