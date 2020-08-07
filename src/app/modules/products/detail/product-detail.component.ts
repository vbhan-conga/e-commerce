import { Component, OnInit, ViewChild } from '@angular/core';
import { CartService, CartItem, Storefront, StorefrontService, BundleProduct } from '@apttus/ecommerce';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductConfigurationSummaryComponent, ProductConfigurationComponent } from '@apttus/elements';
import { ProductDetailsState, ProductDetailsResolver } from '../services/product-details.resolver';
import { plainToClass } from 'class-transformer';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
/**
 * Product Details Component is the details of the product for standalone and bundle products with attributes and options.
 */
export class ProductDetailComponent implements OnInit {

    cartItemList: Array<CartItem>;
    product: BundleProduct;
    viewState$: BehaviorSubject<ProductDetailsState>;

    /**
     * Flag to detect if there is change in product configuration.
     */
    configurationChanged: boolean = false;

    quantity: number = 1;
    /**
     * Flag used in update configuration method
     */
    saving: boolean = false;
    /**
     * Default term is set to 1.
     */
    term: number = 1;

    /** @ignore */
    productCode: string;

    storefront$: Observable<Storefront> = null;

    @ViewChild(ProductConfigurationSummaryComponent, { static: false })
    configSummaryModal: ProductConfigurationSummaryComponent;

    @ViewChild(ProductConfigurationComponent, { static: false })
    prodConfigComponent: ProductConfigurationComponent;

    constructor(private cartService: CartService,
                private resolver: ProductDetailsResolver,
                private router: Router,
                private storefrontService: StorefrontService) { }

    ngOnInit() {
        this.viewState$ = this.resolver.state();
        this.storefront$ = this.storefrontService.getStorefront();
    }

    /**
     * onConfigurationChange method is invoked whenever there is change in product configuration and this method ets flag
     * isConfigurationChanged to true.
     */
    onConfigurationChange(result: any) {
        this.product = _.first(result);
        this.cartItemList = result[1];
        if (_.get(_.last(result),'optionChanged') || _.get(_.last(result),'attributeChanged')) this.configurationChanged = true;
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
        const primaryItem = _.find(cartItems, i => _.get(i, 'IsPrimaryLine') === true && _.isNil(_.get(i, 'Option')));
        if (!_.isNil(primaryItem) && (_.get(primaryItem, 'Product.HasOptions') || _.get(primaryItem, 'Product.HasAttributes')))
            this.router.navigate(['/products', _.get(this, 'viewState$.value.product.Id'), _.get(primaryItem, 'Id')]);

        if(this.quantity <= 0) {
            this.quantity = 1;
        }
    }

    changeProductQuntity(newQty: any){
        if(this.cartItemList && this.cartItemList.length > 0)
            _.forEach(this.cartItemList, c => {
                if(c.LineType === 'Product/Service') c.Quantity = newQty;
                this.prodConfigComponent.changePrductQty(newQty);
          });
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
