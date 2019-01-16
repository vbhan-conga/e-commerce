import { Input, Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Product, ProductInformation, ProductInformationService } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';
@Component({
    selector: 'pdp-tab-attachments',
    template: `
      <table class="table table-sm">
        <thead>
          <tr>
            <th scope="col" class="border-top-0">File Name</th>
            <th scope="col" class="border-top-0">Description</th>
            <th scope="col" class="border-top-0">Created Date</th>
            <th scope="col" class="border-top-0">Information Type</th>
          </tr>
        </thead>
        <tbody>
          <ng-container *ngFor="let item of (productInformation$ | async)">
            <tr *ngFor="let attachment of item?.Attachments">
              <td><a href="{{getAttachmentUrl(attachment.Id, item.ProductId)}}" target="_blank">{{attachment.Name}}</a></td>
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
export class TabAttachmentsComponent implements OnInit{
    @Input() product: Product;
    productInformation$ : Observable<ProductInformation[]>;

    constructor(private productInformationService: ProductInformationService){}

    ngOnInit(){
      this.productInformation$ = this.productInformationService.getProductInformation(this.product.Id);
    }

    getAttachmentUrl(attachmentId, productId){
      return this.productInformationService.getAttachmentUrl(attachmentId,productId);
    }
}