import { Component, OnInit, OnDestroy } from '@angular/core';
import { AssetService, AssetLineItem } from '@apttus/abo';
import { ACondition, APageInfo, ASort } from '@apttus/core';
import { CartService, Cart, Storefront, StorefrontService, ProductService } from '@apttus/ecommerce';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { AssetSelectionService } from '@apttus/elements';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

/**
* Installed Product Layout is used to set the structure of the installed products page.
*
* @example
* <app-installed-products-layout></app-installed-products-layout>
*/
@Component({
  selector: 'app-installed-products-layout',
  templateUrl: './installed-products-layout.component.html',
  styleUrls: ['./installed-products-layout.component.scss'],
  providers: [DatePipe]
})
export class InstalledProductsLayoutComponent implements OnInit, OnDestroy {
  /**
   * The current page used by the pagination component.
   */
  page = 1;
  /**
   * Number of records per page used by the pagination component.
   */
  pageSize = 12;
  /**
   * Max number of asset line item records to fetch.
   */
  maxRecords = 100;
  /**
   * Current value of the search input to be used for finding records.
   */
  searchQuery: string;
  /**
   * Observable instance of the current page of assets.
   */
  assets$: Observable<Array<AssetLineItem>>;
  /**
   * Observable instance of all assets after filtered criteria.
   */
  searchResults$: Observable<Array<AssetLineItem>>;
  /**
   * Array of conditions to be used for populating search results.
   */
  conditions: Array<ACondition> = [];
  /**
   * Observable array of all assets that have been selected from the asset list.
   */
  selectedAssets$: Observable<Array<AssetLineItem>>;
  /**
   * Product Id from the route params.
   */
  _selectedProductID: string;

  /**
   * List of selected product Ids
   */
  newIdentifiers: Array<string>;

  /**
   * local variable used to check ABO operation
   */
  _isABOOperation: boolean;

  /**
   * operation from the route params.
   */
  operation: string;
  /**
   * Instance of the current cart.
   */
  cart: Cart;
  /**
  * Stores all the details about current storefront object
  */
  storefront$: Observable<Storefront>;
  /**
   * Value of the days to renew filter.
   */
  renewFilter: ACondition;
  /**
   * Value of the product family field filter.
   */
  productFamilyFilter: ACondition;
  /**
   * Flag for checking if the full list is being shown or if only selected assets are being shown.
   */
  showingFullList: boolean = true;
  /**
   * Total number of selected items to pass to pagination component when showing only selected assets.
   */
  selectedTotalItems: Array<AssetLineItem>;
  /**
   * Selected assets to show for the current page.
   */
  selectedPageItems: Array<AssetLineItem>;
  /**
   * Current subscriptions in this class.
   * @ignore
   */
  protected subs: Array<any> = [];
  /**
   * Object used for managing filters that are set on the asset list.
   */
  priceTypeFilters = {
    /**
     * Filter for 'One Time' price type assets.
     */
    'One Time': new ACondition(this.assetService.type, 'PriceType', 'Equal', 'One Time'),
    /**
     * Filter for 'Recurring' price type assets.
     */
    Recurring: new ACondition(this.assetService.type, 'PriceType', 'Equal', 'Recurring'),
    /**
     * Filter for 'Usage' price type assets.
     */
    Usage: new ACondition(this.assetService.type, 'PriceType', 'Equal', 'Usage'),
    /**
     * Removes all current filters on the asset list.
     */
    removeFilters: () => {
      _.remove(this.conditions, this.priceTypeFilters['One Time']);
      _.remove(this.conditions, this.priceTypeFilters.Recurring);
      _.remove(this.conditions, this.priceTypeFilters.Usage);
    },
    /**
     * Adds a new filter to the list of the given type in this object.
     * @param key {String} Key for the filter type on this object.
     */
    addFilter: key => {
      this.priceTypeFilters.removeFilters();
      this.conditions.push(this.priceTypeFilters[key]);
    }
  };

  constructor(
    private route: ActivatedRoute,
    public assetService: AssetService,
    private assetSelectionService: AssetSelectionService,
    protected cartService: CartService,
    protected toastr: ToastrService,
    private storefrontService: StorefrontService,
    public fieldFilterServiceContext: ProductService
  ) {
    this.subs.push(this.cartService.getMyCart().subscribe(cartRes => {
      this.cart = cartRes;
    }));
  }

  /**
   * @ignore
   */
  ngOnInit() {
    this.storefront$ = this.storefrontService.getStorefront();
    this._selectedProductID = this.route.snapshot.params.productId;
    this.operation = this.route.snapshot.params.operation;
    this._isABOOperation = (this._selectedProductID != null && this._selectedProductID !== undefined && (this.operation === 'Renew' || this.operation === 'Terminate'));
    if (this._isABOOperation) {
      this.newIdentifiers = decodeURIComponent(this._selectedProductID).split(',');
      this.conditions.push(new ACondition(this.assetService.type, 'ProductId', 'In', this.newIdentifiers));
    }
    this.selectedAssets$ = this.assetSelectionService.getSelectedAssets();
    this.getResults();
    this.assetService.getAssetLineItemForAccount().take(1).subscribe(assets => {
      let families = [];
      assets.forEach(asset => {
        if (!_.includes(families, asset.Product.Family)) {
          if (asset.Product.Family != null) families.push(asset.Product.Family);
        }
      });
    });
  }
  /**
   * Gets the search results based on the current applied filters.
   */
  getResults() {
    let results: Array<AssetLineItem>;
    if (this.searchQuery) {
      this.searchResults$ = this.assetService.search(this.searchQuery, this.conditions, 'AND', null, null, new APageInfo(this.maxRecords, 1));
      this.assets$ = this.assetService.search(this.searchQuery, this.conditions, 'AND', null, null, new APageInfo(this.pageSize, this.page));
    }
    else {
      this.searchResults$ = this.assetService.getAssetLineItemForAccount(null, this.conditions, [new ASort(this.assetService.type, 'Product.Name')], new APageInfo(this.maxRecords, 1));
      this.assets$ = this.assetService.getAssetLineItemForAccount(null, this.conditions, [new ASort(this.assetService.type, 'Product.Name')], new APageInfo(this.pageSize, this.page));
    }
    if (this._isABOOperation) {
      this.searchResults$.take(1).subscribe(assetsData => {
        if (assetsData != null) {
          this.newIdentifiers.forEach(productId => {
            this.assetSelectionService.addAssetToSelection(assetsData.filter(data => data.ProductId === productId)[0]);
          });
        }
      });
    }
  }
  /**
   * Event handler for when the days to renew filter is changed.
   * @param event The Event that was fired.
   */
  onRenewalChange(event: ACondition) {
    if (this.renewFilter) _.remove(this.conditions, this.renewFilter);
    if (event.value !== null) {
      this.renewFilter = event;
      this.conditions.push(this.renewFilter);
    }
    this.getResults();
  }
  /**
   * Event handler for when price type filter is changed.
   * @param event Event object that was fired.
   */
  onPriceTypeChange(event: any) {
    if (event) {
      this.priceTypeFilters.addFilter(event);
    }
    else this.priceTypeFilters.removeFilters();
    this.getResults();
  }
  /**
   * Event handler for when search input is changed.
   */
  handleSearchChange() {
    this.getResults();
  }
  /**
   * Event handler for the pagination component when the page is changed.
   * @param evt Event object that was fired.
   */
  onPage(evt) {
    this.page = evt.page;
    if (this.showingFullList) {
      this.getResults();
    }
    else {
      this.selectedPageItems = this.getPageForSelectedList();
    }
  }
  /**
   * Gets the array of selected assets for the current page.
   * @returns Selected assets for the current page.
   * @ignore
   */
  private getPageForSelectedList(): Array<AssetLineItem> {
    return this.selectedTotalItems.slice(this.pageSize * (this.page - 1), this.pageSize * this.page);
  }
  /**
   * Event handler for showing only the selected assets in the asset list.
   * @param event Array of asset line items that was fired on this event.
   */
  handleSelectedAmountClick(event: Array<AssetLineItem>) {
    this.selectedTotalItems = event;
    this.selectedPageItems = this.getPageForSelectedList();
    this.showingFullList = false;
  }
  /**
   * Event handler for showing the full list of assets both selected and not selected.
   */
  handleFullListClick() {
    this.showingFullList = true;
    this.getResults();
  }
  /**
   * Event handler for when the input select component changes. Adds or removes an ACondition to the conditions list based on what the event value is.
   * @param event Event objec that was fired.
   */
  handlePicklistChange(event: any) {
    if (this.productFamilyFilter) _.remove(this.conditions, this.productFamilyFilter);
    if (event.length > 0) {
      let values = [];
      event.forEach(item => values.push(item.value));
      this.productFamilyFilter = new ACondition(this.fieldFilterServiceContext.type, 'Product.Family', 'In', values);
      this.conditions.push(this.productFamilyFilter);
    }
    this.getResults();
  }

 /**
  * @ignore
 */
  ngOnDestroy() {
    this.assetSelectionService.clearSelection();
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
