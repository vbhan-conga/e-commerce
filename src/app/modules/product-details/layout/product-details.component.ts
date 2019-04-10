import { Component, OnInit, ElementRef, HostListener, ViewChild, Output } from '@angular/core';
import { ProductService, Product, ProductOptionForm, CartService, CartItem, PriceListItem, CartItemService, ProductAttributeValue } from '@apttus/ecommerce';
import { ConstraintRuleService } from '@apttus/constraint-rules';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ACondition, ConfigurationService } from '@apttus/core';
import { BehaviorSubject } from 'rxjs';
import { ExceptionService, ProductConfigurationService } from '@apttus/elements';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
/**
 * Product Details Component is the details of the product for standalone and bundle products with attributes and options.
 */
export class ProductDetailsComponent implements OnInit {

    product: Product;
    /**
     * Flag to detect if their is change in product configuration.
     */
    isConfigurationChanged: boolean = false;
    /**
     * Storing the list of selected option list
     */
    productOptionFormList: Array<ProductOptionForm> = new Array<ProductOptionForm>();
    /**
     * Stores the attribute value of the main product.
     */
    attributeValue: ProductAttributeValue = new ProductAttributeValue();
    /**
     * Observable of array of product.
     */
    recommendedProducts$: Observable<Array<Product>>;

    populateDefaults: boolean = true;
    quantity: number = 1;
    priceListItem: PriceListItem;
    /**
     * type string cart line item id
     */
    cartItemId: string;
    /**
     * Flag used in update configuration method 
     */
    saving: boolean = false;
    /**
     * boolean Flag used if quantity is updated.
     */
    isQuantityUpdated: boolean = false;
    /**
     * Default term is set to 1.
     */
    term: number = 1;
    /**
     * Flag to disable and enable add to cart and update configuartion button.
     */
    setDisabled: boolean = false;

    @Output() onAddToCart: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    @ViewChild('details') details: ElementRef;
    @ViewChild('config') config: ElementRef;
    @ViewChild('attachments') attachments: ElementRef;
    @ViewChild('specifications') specifications: ElementRef;
    @ViewChild('recommendations') recommendations: ElementRef;
    
    /**
     * HostListener Decorator a DOM event to listen for, and provides a handler method to run when that 
     * event occurs. Here attaches listener to window on scroll event.
     * In onScroll method assigns headerClass property with the class "'fixed-top' | 'fixed-top expand'" based on window 
     * pageYOffset and set the tab active.
     */
    @HostListener('window:scroll', ['$event'])
    onScroll(event) {
        if (this.headerClass != null && window.pageYOffset < 85) {
            this.headerClass = 'fixed-top expand';
            setTimeout(() => this.headerClass = null, 200);
        } else if (window.pageYOffset >= 85) {
            this.headerClass = 'fixed-top';
        } else {
            this.headerClass = null;
        }

        this.setActiveTab(window.pageYOffset);
    }
    headerClass: 'fixed-top' | 'fixed-top expand' = null;

    /**
     * List of tab to be displayed in product detail page.
     */
    tabList: Array<ProductDetailTab>;
    private activeTabIndex = 0;
    private headerHeight = 200;

    constructor(private route: ActivatedRoute,
        private productService: ProductService,
        private configurationService: ConfigurationService,
        private exceptionService: ExceptionService,
        private cartItemService: CartItemService,
        private constraintRuleService: ConstraintRuleService,
        private cartService: CartService,
        private productConfigService: ProductConfigurationService) { }

    ngOnInit() {
        this.route.params
            .flatMap(params => {
                this.product = null;
                this.cartItemId = _.get(params, 'cartItemId');
                return this.productService.where([new ACondition(Product, this.configurationService.get('productIdentifier'), 'Equal', _.get(params, 'productCode'))]);
            })
            .map(res => res[0])
            .filter(product => product != null)
            .subscribe(product => this.onProductLoad(product));

        this.productConfigService.disableAddToCartBtn.subscribe(disableBtn => {
            this.setDisabled = disableBtn;
        });

    }
    /**
     * scrollTo method scrolls the page to the specified tab content.
     */
    scrollTo(tab: ProductDetailTab) {
        if (tab.section)
            window.scrollTo({ top: tab.section.nativeElement.offsetTop - this.headerHeight, left: 0, behavior: 'smooth' });
        setTimeout(() => {
            this.tabList.forEach(t => t.active = false);
            tab.active = true;
            this.activeTabIndex = _.findIndex(this.tabList, t => t.label === tab.label);
        }, 500);
    }

    setActiveTab(windowPosition) {
        let index = 0;
        if (this.tabList) {
            this.tabList.forEach((tab, idx) => {
                if (tab.section != null && windowPosition + (this.headerHeight * 1.5) >= tab.section.nativeElement.offsetTop)
                    index = idx;
            });

            if (index !== this.activeTabIndex) {
                this.tabList.forEach(t => t.active = false);
                this.tabList[index].active = true;
                this.activeTabIndex = index;
            }
        }
    }

    /**
     * On Product Load method loads the product  
     * @param product consists of product object.
     */
    onProductLoad(product: Product) {
        this.product = product;
        this.priceListItem = ((_.get(this.product, 'PriceLists')).length > 1) ? this.getPrimaryPriceListItem(this.product) : this.product.PriceLists[0];
        this.recommendedProducts$ = this.constraintRuleService.getRecommendationsForProducts([product]);
        if (this.cartItemId) {
            this.populateDefaults = false;

            this.cartItemService.get([this.cartItemId])
                .map(res => res[0])
                .subscribe(cartItem => {
                    if (cartItem) {
                        this.quantity = cartItem.Quantity;
                        this.term = cartItem.SellingTerm;
                        this.priceListItem = _.get(cartItem, 'PriceListItem');
                    } else {
                        delete this.cartItemId;
                    }
                });
        }

        setTimeout(() => this.buildTabs(), 100);
    }

    /**
     * onConfigurationChange method is invoked whenever there is change in product configuration and this method ets flag
     * isConfigurationChanged to true.
     */
    onConfigurationChange() {
        this.isConfigurationChanged = true;
    }

    /**
     * getPrimaryPriceListItem method gets the pricelistitem for the product.
     * @param product consists of product object properties.
     */
    getPrimaryPriceListItem(product) {
        const res = product.PriceLists.find(pli => pli.Sequence === 1);
        return (_.isUndefined(res)) ? product.PriceLists[0] : res;
    }

    /**
     * updateConfiguration method is invoked when update configuration button is clicked i.e after editing the product.
     * It updates the cart and cartline item which is edited.
     * @fires CartService.updateConfigurationsOnCartItem()
     */
    updateConfiguration() {
        this.saving = true;
        this.cartService.updateConfigurationsOnCartItem(this.cartItemId, this.productOptionFormList, this.attributeValue, this.quantity)
            .subscribe(res => {
                this.saving = false;
                this.exceptionService.showSuccess('Your configuration has been updated.');
                this.isConfigurationChanged = false;
            },
                err => {
                    console.log(err);
                    this.saving = false;
                    this.exceptionService.showError(new Error('Could not update your configuration'));
                }
            )
    }

    changeQuantity() {
        this.isQuantityUpdated = true;
    }
    
/**
   * Changes the quantity of the cart item passed to this method.
   *
   * @param cartItem Cart item reference to the cart line item object.
   * @fires CartService.updateQuantity()
   */

    handleStartChange(cartItem: CartItem) {
        this.cartService.updateQuantity([cartItem]);
    }

/**
   * Changes the quantity of the cart item passed to this method.
   *
   * @param cartItem Cart item reference to the cart line item object.
   * @fires CartService.updateQuantity()
   */
    handleEndDateChange(cartItem: CartItem) {
        this.cartService.updateQuantity([cartItem]);
    }
    /**
     * List of tabs to be displayed for product details.
     * Here the tabs are referring to ProductDetailTab interface.
     */
    buildTabs() {
        this.tabList = _.orderBy([
            {
                label: 'Configurations',
                active: false,
                section: this.config,
                showLabel: true
            },
            {
                label: 'Details',
                active: true,
                section: this.details,
                showLabel: true
            },
            {
                label: 'Attachments',
                active: false,
                section: this.attachments,
                showLabel: true
            },
            {
                label: 'Specifications',
                active: false,
                section: this.specifications,
                showLabel: true
            },
            {
                label: 'Recommended Products',
                active: false,
                section: this.recommendations,
                showLabel: true
            }
        ], 'section.nativeElement.offsetTop');
    }
}

export interface ProductDetailTab {
    label: string;
    active: boolean;
    section: ElementRef;
    showLabel: boolean;
}