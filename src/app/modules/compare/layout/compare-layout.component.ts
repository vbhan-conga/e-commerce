import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '@apttus/ecommerce';
import { ConfigurationService, ACondition } from '@apttus/core';
import { ProductDrawerService, ProductSelectionService } from '@apttus/elements';

@Component({
  selector: 'app-compare-layout',
  templateUrl: './compare-layout.component.html',
  styleUrls: ['./compare-layout.component.scss']
})
export class CompareLayoutComponent implements OnInit, OnDestroy {

  products: Array<Product>;
  identifiers: Array<string>;
  /**
   * The product identifier set in the configuration file.
   */
  identifier: string = 'Id';

  constructor(private config: ConfigurationService, private activatedRoute: ActivatedRoute, private router: Router, private productService: ProductService, private productSelectionService: ProductSelectionService, private productDrawerService: ProductDrawerService) {
    this.identifier = this.config.get('productIdentifier');
  }

  private subs: Array<any> = [];

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let newIdentifiers = decodeURIComponent(params.products).split(',');
      if (newIdentifiers.length > 5) {
        newIdentifiers = newIdentifiers.splice(0, 5);
        this.router.navigateByUrl(`/compare?products=${newIdentifiers.join(',')}`);
      }
      else {
        this.subs.push(this.productService.where([new ACondition(this.productService.type, this.identifier, 'In', newIdentifiers)]).subscribe(products => {
          const tableProducts = products.filter(product => newIdentifiers.includes(product[this.identifier]));
          this.products = tableProducts;
          this.productSelectionService.setSelectedProducts(tableProducts);
          if (newIdentifiers.length < 2) this.router.navigateByUrl('/');
          this.identifiers = tableProducts.map(product => product[this.identifier]);
          this.productDrawerService.closeDrawer();
          // wait for product drawer subscription to fire to close drawer if on the compare page.
          setTimeout(() => {
            this.productDrawerService.closeDrawer();
          }, 0);
        }));
      }
    });
  }

  ngOnDestroy() {
    if (this.subs && this.subs.length > 0) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

}
