import {
  Component,
  NgZone,
  Input,
  OnChanges
} from '@angular/core';
import { Product, ProductService, ProductInformation, ProductInformationService, Attachment } from '@apttus/ecommerce';
import { ImagePipe, ConfigurationService } from '@apttus/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'product-images',
  template: `
    <ngx-gallery [options]="galleryOptions" [images]="galleryImages" *ngIf="!showBlank && galleryImages && galleryImages.length > 0"></ngx-gallery>
    <img [lazyLoad]="null | image" *ngIf="showBlank" class="w-100 img-fluid"/>
  `,
  styles: []
})
export class ProductImagesComponent implements OnChanges {
  @Input() product: Product;
  @Input() thumbnails: boolean = true;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  showBlank = false;
  productInformation$: Observable<ProductInformation[]>;

  constructor(private ngZone: NgZone, private productService: ProductService, private dss: DomSanitizer, private config: ConfigurationService, private productInformationService: ProductInformationService) { }


  ngOnChanges() {
    if (this.product) {
      this.productInformationService.getProductInformation(this.product.Id).subscribe(result => {
        const Attachments = result.map(res => res.Attachments);
        if(Attachments) {
          this.galleryOptions = [
            {
              width: '100%',
              thumbnailsColumns: 4,
              imageAnimation: NgxGalleryAnimation.Slide,
              imageSize: 'contain',
              arrowPrevIcon: 'fa fa-arrow-circle-left text-dark',
              arrowNextIcon: 'fa fa-arrow-circle-right text-dark',
              thumbnailsArrows: false,
              imageInfinityMove: true,
              closeIcon: 'fa fa-times-circle-o text-dark',
              thumbnails: this.thumbnails && Attachments.length > 1,
              previewCloseOnClick: true,
              previewCloseOnEsc: true,
            },
            // max-width 400
            {
              breakpoint: 767,
              preview: false,
              width: '100%',
              imagePercent: 80,
              thumbnails: this.thumbnails && Attachments.length > 1,
              thumbnailsPercent: 20,
              thumbnailsMargin: 20,
              thumbnailMargin: 20
            }
          ];
          this.galleryImages = [];
          result.forEach(productinfo => {
            if (_.get(productinfo, 'Attachments')) {
              productinfo.Attachments.forEach(attachment => {
                this.galleryImages.push({
                  small: new ImagePipe(this.config, this.dss).transform(attachment.Id, true, false, productinfo.ProductId),
                  medium: new ImagePipe(this.config, this.dss).transform(attachment.Id, true, false, productinfo.ProductId),
                  big: new ImagePipe(this.config, this.dss).transform(attachment.Id, true, false, productinfo.ProductId)
                });
              });
            }
          });
          if (!this.galleryImages || this.galleryImages.length === 0)
            this.showBlank = true;
        }
      });
    }
  }
}
