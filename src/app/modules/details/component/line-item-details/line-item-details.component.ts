import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { OrderLineItem, QuoteLineItem } from '@apttus/ecommerce';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ConfigurationService } from '@apttus/core';

/**
 * Line item details component shows the details of order line item or quote line item.
 */
@Component({
  selector: 'app-line-item-details',
  templateUrl: './line-item-details.component.html',
  styleUrls: ['./line-item-details.component.scss']
})
export class LineItemDetailsComponent implements OnInit {

  @Input() lineItems: Array<OrderLineItem> | Array<QuoteLineItem>;

  selectedLineItem: any;
  modalRef: BsModalRef;

  identifier: string = this.configurationService.get('productIdentifier');

  constructor(private configurationService: ConfigurationService, private modalService: BsModalService) { }

  ngOnInit() {
  }

  /**
   * @ignore
   */
  openModal(lineItem: OrderLineItem, template: TemplateRef<any>) {
    this.selectedLineItem = lineItem;
    this.modalRef = this.modalService.show(template, {class:'modal-lg'});
  }

}