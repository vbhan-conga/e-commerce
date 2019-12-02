import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Cart, CartService, Product, ConstraintRuleService, CartItemService, ItemGroup } from '@apttus/ecommerce';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ManageCartResolver, ManageCartState } from '../services/manage-cart.resolver';

@Component({
  selector: 'app-manage-cart',
  templateUrl: './manage-cart.component.html',
  styleUrls: ['./manage-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * Manage Cart component is used to show the list of cart line item(s)  and summary of the cart.
 */
export class ManageCartComponent implements OnInit {
  @ViewChild('discardChangesTemplate', { static: false }) discardChangesTemplate: TemplateRef<any>;


  discardChangesModal: BsModalRef;
  /**
   * Observable of the information for rendering this view.
   */
  view$: Observable<ManageCartState>;

  constructor(private cartService: CartService, private cartItemService: CartItemService, private crService: ConstraintRuleService, private resolver: ManageCartResolver) { }

  ngOnInit() {
    this.view$ = this.resolver.state();
  }

  trackById(index, record): string {
    return _.get(record, 'MainLine.Id');
  }
}
