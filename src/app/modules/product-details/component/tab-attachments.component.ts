import { Input, Component,ChangeDetectionStrategy, Inject } from '@angular/core';
import { Product, ProductInformation } from "@apttus/ecommerce";
import { Observable } from 'rxjs/Observable';
import { ProductInformationService } from '../../../services/product-information.service';

@Component({
    selector: 'pdp-tab-attachments',
    template: `
      <table class="table table-sm">
        <thead>
          <tr>
            <th scope="col" class="border-top-0">File Name</th>
            <th scope="col" class="border-top-0">Size</th>
            <th scope="col" class="border-top-0">Description</th>
            <th scope="col" class="border-top-0">Created Date</th>
            <th scope="col" class="border-top-0">Information Type</th>
          </tr>
        </thead>
        <tbody>
          <ng-container *ngFor="let item of (productInformation$ | async)">
            <tr *ngFor="let attachment of item?.Attachments">
              <td><a href="{{url+attachment.Id}}" target="_blank">{{attachment.Name}}</a></td>
              <td>{{attachment.BodyLength | fileSize}}</td>
              <td>{{attachment.Description}}</td>
              <td>{{attachment.CreatedDate | date : 'short'}}</td>
              <td>{{item.InformationType}}</td>
            </tr>
          </ng-container>
        </tbody>
      </table>
    `,
    styles: [`
      :host{
        font-size: smaller;
      }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabAttachmentsComponent{
    @Input() product: Product;
    productInformation$ : Observable<ProductInformation[]>;
    url: string;
    constructor(private productInformationService: ProductInformationService){
      this.url = this.productInformationService.config.endpoint+'/servlet/servlet.FileDownload?file=';
    }

    ngOnInit(){
      this.productInformation$ = this.productInformationService.getProductInformation(this.product.Id);
    }
}