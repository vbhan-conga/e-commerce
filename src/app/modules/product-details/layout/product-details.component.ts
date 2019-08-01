import { Component, OnInit, ViewChild } from '@angular/core';
import { CartService, CartItem } from '@apttus/ecommerce';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { ProductConfigurationSummaryComponent } from '@apttus/elements';
import { ProductDetailsState, ProductDetailsResolver } from '../services/product-details.resolver';
import { LineStatus } from '@apttus/ecommerce';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
/**
 * Product Details Component is the details of the product for standalone and bundle products with attributes and options.
 */
export class ProductDetailsComponent implements OnInit {

    cartItemList: Array<CartItem>;
    viewState$: BehaviorSubject<ProductDetailsState>;

    /**
     * Flag to detect if their is change in product configuration.
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

    @ViewChild('productConfigurationSummary') productConfigurationSummary: ProductConfigurationSummaryComponent;

    constructor(private cartService: CartService, private resolver: ProductDetailsResolver, private router: Router) { }

    ngOnInit() {
        this.viewState$ = this.resolver.state();
    }

    /**
     * onConfigurationChange method is invoked whenever there is change in product configuration and this method ets flag
     * isConfigurationChanged to true.
     */
    onConfigurationChange(result: any) {
        const cartItemList: Array<CartItem> = result[0];
        const disable: boolean = result[1];
        if (disable) {
            this.configurationChanged = !disable;
        } else {
            this.configurationChanged = _.some(cartItemList, c => _.includes([LineStatus.Amend, LineStatus.Cancel, LineStatus.New, LineStatus.Upgrade], _.get(c, 'LineStatus')));
        }
        this.cartItemList = cartItemList;
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
        const primaryItem = _.find(cartItems, i => _.get(i, 'IsPrimaryLine') === true && _.isNil(_.get(i, 'Option')) && _.get(i, 'LineNumber') === _.get(i, 'PrimaryLineNumber'));
        if (!_.isNil(primaryItem))
            this.router.navigate(['/product', _.get(this, 'viewState$.value.product.Id'), _.get(primaryItem, 'Id')]);
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
}