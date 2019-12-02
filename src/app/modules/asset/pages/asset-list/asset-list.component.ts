import { Component, OnInit } from '@angular/core';
import { TableOptions } from '@apttus/elements';
import { AssetLineItemExtended } from '@apttus/ecommerce';

@Component({
  selector: 'ngsw-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {

  type = AssetLineItemExtended;

  tableOptions: TableOptions = {
    groupBy: 'Product.Name',
    columns: [
      { prop: 'Name' },
      { prop: 'SellingFrequency' },
      { prop: 'NetUnitPrice' },
      { prop: 'PriceType' },
      { prop: 'StartDate' },
      { prop: 'EndDate' },
      { prop: 'Quantity' },
      { prop: 'AssetStatus' },
      { prop: 'NetPrice' }
    ]
  };

  constructor() { }

  ngOnInit() {
  }
}
