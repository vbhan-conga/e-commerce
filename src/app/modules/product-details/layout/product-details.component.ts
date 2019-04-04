import { Component, OnInit, ElementRef, HostListener, ViewChild, Output } from '@angular/core';
import { ProductService, Product, ProductOptionForm, CartService, CartItem, PriceListItem, CartItemService, ProductAttributeValue } from '@apttus/ecommerce';
import { ConstraintRuleService } from '@apttus/constraint-rules';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ACondition, ConfigurationService } from '@apttus/core';
import { BehaviorSubject  } from 'rxjs';
import { ExceptionService , ProductConfigurationService} from '@apttus/elements';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product;
  isConfigurationChanged: boolean = false;

  productOptionFormList: Array<ProductOptionForm> = new Array<ProductOptionForm>();
  attributeValue: ProductAttributeValue = new ProductAttributeValue();
  recommendedProducts$: Observable<Array<Product>>;

  populateDefaults: boolean = true;
  quantity: number = 1;
  priceListItem: PriceListItem;
  cartItemId: string;
  saving: boolean = false;
  isQuantityUpdated: boolean = false;
  term: number = 1;
  setDisabled: boolean = false;

  @Output() onAddToCart: BehaviorSubject <boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild('details') details: ElementRef;
  @ViewChild('config') config: ElementRef;
  @ViewChild('attachments') attachments: ElementRef;
  @ViewChild('specifications') specifications: ElementRef;
  @ViewChild('recommendations') recommendations: ElementRef;

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (this.headerClass != null && window.pageYOffset < 85){
      this.headerClass = 'fixed-top expand';
      setTimeout(() => this.headerClass = null, 200);
    }else if(window.pageYOffset >= 85){
      this.headerClass = 'fixed-top';
    }else{
      this.headerClass = null;
    }

    this.setActiveTab(window.pageYOffset);
  }
  headerClass: 'fixed-top' | 'fixed-top expand' = null;


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

  scrollTo(tab: ProductDetailTab){
    if(tab.section)
      window.scrollTo({ top: tab.section.nativeElement.offsetTop - this.headerHeight, left: 0, behavior: 'smooth'});
    setTimeout(() => {
      this.tabList.forEach(t => t.active = false);
      tab.active = true;
      this.activeTabIndex = _.findIndex(this.tabList, t => t.label === tab.label);
    }, 500);
  }

  setActiveTab(windowPosition){
    let index = 0;
    if(this.tabList){
      this.tabList.forEach((tab, idx) => {
        if(tab.section != null && windowPosition + (this.headerHeight * 1.5) >= tab.section.nativeElement.offsetTop)
          index = idx;
      });

      if(index !== this.activeTabIndex){
        this.tabList.forEach(t => t.active = false);
        this.tabList[index].active = true;
        this.activeTabIndex = index;
      }
    }
  }

  onProductLoad(product: Product){
    this.product = product;
    this.priceListItem = ((_.get(this.product,'PriceLists')).length > 1)?this.getPrimaryPriceListItem(this.product):this.product.PriceLists[0];
    this.recommendedProducts$ = this.constraintRuleService.getRecommendationsForProducts([product]);
    if(this.cartItemId){
      this.populateDefaults = false;
      
      this.cartItemService.get([this.cartItemId])
        .map(res => res[0])
        .subscribe(cartItem => {
          if(cartItem){
            this.quantity = cartItem.Quantity;
            this.term = cartItem.SellingTerm;
            this.priceListItem = _.get(cartItem, 'PriceListItem');
          }else{
            delete this.cartItemId;
          }
        });
    }

    setTimeout(() => this.buildTabs(), 100);
  }

  onConfigurationChange(){
    this.isConfigurationChanged = true;
  }

  getPrimaryPriceListItem(product){
    const res = product.PriceLists.find(pli => pli.Sequence === 1);
    return (_.isUndefined(res))?product.PriceLists[0]:res;
  }

  updateConfiguration(){
    this.saving = true;
    this.cartService.updateConfigurationsOnCartItem(this.cartItemId, this.productOptionFormList, this.attributeValue, this.quantity)
    .subscribe(res => 
      {
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

  changeQuantity(){
    this.isQuantityUpdated = true;
   }

  handleStartChange(cartItem: CartItem) {
    this.cartService.updateQuantity([cartItem]);
  }

  handleEndDateChange(cartItem: CartItem) {
    this.cartService.updateQuantity([cartItem]);
  }

  buildTabs(){
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

export interface ProductDetailTab{
  label: string;
  active: boolean;
  section: ElementRef;
  showLabel: boolean;
}