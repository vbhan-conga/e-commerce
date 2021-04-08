import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of, Observable } from 'rxjs';
import { switchMap, map as rmap } from 'rxjs/operators';
import { first, last, get, isNil, find } from 'lodash';

import { ApiService } from '@apttus/core';
import {
    CartService,
    CartItem,
    ConstraintRuleService,
    TranslatorLoaderService,
    Product,
    ProductService
} from '@apttus/ecommerce';
import { ProductConfigurationSummaryComponent } from '@apttus/elements';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
/**
 * Product Details Component is the details of the product for standalone and bundle products with attributes and options.
 */
export class ProductDetailComponent implements OnInit {

    viewState$: Observable<ProductDetailsState>;

    recommendedProducts$: Observable<Array<Product>>;

    cartItemList: Array<CartItem>;

    product: Product;

    /**
     * Flag to detect if there is change in product configuration.
     */
    configurationChanged: boolean = false;

    quantity: number = 1;

    /** @ignore */
    productCode: string;

    @ViewChild(ProductConfigurationSummaryComponent, { static: false })
    configSummaryModal: ProductConfigurationSummaryComponent;

    constructor(private cartService: CartService,
                private router: Router,
                private route: ActivatedRoute,
                private productService: ProductService,
                private translatorService: TranslatorLoaderService,
                private apiService: ApiService,
                private crService: ConstraintRuleService) {
        this.product = get(this.router.getCurrentNavigation(), 'extras.state');
    }

    ngOnInit() {
        this.viewState$ = this.route.params.pipe(
            switchMap(params => combineLatest([
                this.product ? of(this.product) : this.productService.fetch(get(params, 'id'))
                    .pipe(
                        switchMap(data => this.translatorService.translateData(data)),
                        rmap(first)
                    ),
                (get(params, 'cartItem')) ? this.apiService.get(`/Apttus_Config2__LineItem__c/${get(params, 'cartItem')}?lookups=AttributeValue,PriceList,PriceListItem,Product,TaxCode`, CartItem,) : of(null)
            ])),
            rmap(([product, cartItemList]) => {
                return {
                    product: product as Product,
                    relatedTo: cartItemList,
                    quantity: get(cartItemList, 'Quantity', 1)
                };
            })
        );

        this.recommendedProducts$ = this.route.params.pipe(
            switchMap(params => this.crService.getRecommendationsForProducts([get(params, 'id')])),
            rmap(r => Array.isArray(r) ? r : [])
        );
    }

    /**
     * onConfigurationChange method is invoked whenever there is change in product configuration and this method sets flag
     * isConfigurationChanged to true.
     */
    onConfigurationChange(result: any) {
        this.product = first(result);
        this.cartItemList = result[1];
        if (get(last(result), 'optionChanged') || get(last(result), 'attributeChanged')) this.configurationChanged = true;
    }

    /**
     * Changes the quantity of the cart item passed to this method.
     *
     * @param cartItem Cart item reference to the cart line item object.
     * @fires CartService.updateCartItems()
     */

    handleStartChange(cartItem: CartItem) {
        this.cartService.updateCartItems([cartItem]);
    }

    onAddToCart(cartItems: Array<CartItem>): void {
        this.configurationChanged = false;
        const primaryItem = find(cartItems, i => get(i, 'IsPrimaryLine') === true && isNil(get(i, 'Option')));
        if (!isNil(primaryItem) && (get(primaryItem, 'Product.HasOptions') || get(primaryItem, 'Product.HasAttributes'))) {
            this.router.navigate(['/products', get(this, 'product.Id'), get(primaryItem, 'Id')]);
        }

        if (this.quantity <= 0) {
            this.quantity = 1;
        }
    }

    /**
     * Changes the quantity of the cart item passed to this method.
     *
     * @param cartItem Cart item reference to the cart line item object.
     * @fires CartService.updateCartItems()
     */
    handleEndDateChange(cartItem: CartItem) {
        this.cartService.updateCartItems([cartItem]);
    }

    showSummary() {
        this.configSummaryModal.show();
    }
}

/** @ignore */
export interface ProductDetailsState {
    /**
     * The product to display.
     */
    product: Product;
    /**
     * The CartItem related to this product.
     */
    relatedTo: CartItem;
    /**
     * Quantity to set to child components
     */
    quantity: number;
}
