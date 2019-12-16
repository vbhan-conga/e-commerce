import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from './asset-routing.module';
import { AssetListComponent } from './pages/asset-list/asset-list.component';
import { TableModule } from '@apttus/elements';


@NgModule({
  imports: [
    CommonModule,
    AssetsRoutingModule,
    TableModule
  ],
  declarations: [AssetListComponent]
})
export class AssetModule { }
