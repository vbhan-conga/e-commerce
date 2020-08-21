import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ConfigurationService } from '@apttus/core';
import { CartService, CartItem, Storefront, StorefrontService, BundleProduct, Cart } from '@apttus/ecommerce';
import { ProductConfigurationSummaryComponent, ProductConfigurationService } from '@apttus/elements';
import { ProductDetailsState, ProductDetailsResolver } from '../services/product-details.resolver';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
/**
 * Product Details Component is the details of the product for standalone and bundle products with attributes and options.
 */
export class ProductDetailComponent implements OnInit, OnDestroy {

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

    /**@ignore */
    relatedTo: CartItem;

    storefront$: Observable<Storefront> = null;

    configWindow: any = null;

    @ViewChild(ProductConfigurationSummaryComponent, { static: false })
    configSummaryModal: ProductConfigurationSummaryComponent;
    subscriptions: Array<Subscription> = [];    

    constructor(private cartService: CartService,
                private resolver: ProductDetailsResolver,
                private router: Router,
                private storefrontService: StorefrontService,
                private productConfigurationService: ProductConfigurationService,
                private configService: ConfigurationService) { }

    ngOnInit() {
        this.viewState$ = this.resolver.state();
        this.storefront$ = this.storefrontService.getStorefront();
        this.relatedTo = this.viewState$.value.relatedTo;
        this.subscriptions.push(this.productConfigurationService.configurationChange.subscribe(response => {
            this.product = response.product;
            this.cartItemList = response.itemList;
            if (_.get(response.configurationFlags,'optionChanged') || _.get(response.configurationFlags,'attributeChanged')) this.configurationChanged = true;
        }));
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
        if(this.configWindow) this.configWindow.close();
        this.configurationChanged = false;

        if(_.get(cartItems, 'LineItems') && this.viewState$.value.storefront.ConfigurationLayout === 'Embedded') cartItems = _.get(cartItems, 'LineItems');
        const primaryItem = _.find(cartItems, i => _.get(i, 'IsPrimaryLine') === true && _.isNil(_.get(i, 'Option')));
        this.relatedTo = primaryItem;
        if (!_.isNil(primaryItem) && (_.get(primaryItem, 'Product.HasOptions') || _.get(primaryItem, 'Product.HasAttributes')))
            this.router.navigate(['/products', _.get(this, 'viewState$.value.product.Id'), _.get(primaryItem, 'Id')]);

        if(this.quantity <= 0) {
            this.quantity = 1;
        }
    }

    changeProductQuantity(newQty: any){
        if(this.cartItemList && this.cartItemList.length > 0)
            _.forEach(this.cartItemList, c => {
                if(c.LineType === 'Product/Service') c.Quantity = newQty;
                this.productConfigurationService.changeProductQuantity(newQty);
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

    openConfigWindow(product: BundleProduct, relatedTo?: CartItem) {
        this.subscriptions.push(this.cartService.childCart(_.get(relatedTo, 'LineNumber')).subscribe(res=> {
            const url = relatedTo ? `${this.configService.endpoint()}/apex/Apttus_Config2__Cart#!/flows/ngcpq/businessObjects/${res.BusinessObjectId}/steps/options/lines/${relatedTo.PrimaryLineNumber}/configure` : `${this.configService.endpoint()}/apex/Apttus_Config2__Cart#!/flows/ngcpq/businessObjects/${res.BusinessObjectId}/products/${product.Id}/configure`;
            this.configWindow = window.open(url, 'soWin', 'fullscreen=yes,titlebar=no,toolbar=no,menubar=no,location=no,scrollbars=no,status=no,height=800,width=1250');
        }));
    }

    showSummary() {
      this.configSummaryModal.show();
    }

    ngOnDestroy(){
        _.forEach(this.subscriptions, item => {
            if(item) item.unsubscribe();
        })
    }
}
