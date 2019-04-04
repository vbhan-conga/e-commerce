import { Component, OnInit, TemplateRef, NgZone } from '@angular/core';
import { AccountLocationService, AccountLocation } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
/**
 * Address book component for managing list of addresses. Can  Add, Edit, Delete and Set any address as default.
 */
@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styles: [`
    .info{
      margin: -10px -10px 0 0;
    }
  `]
})
export class AddressBookComponent implements OnInit {
  modalRef: BsModalRef;
  /**
   * List of Addresses for logged in user.
   */
  addressList$: Observable<Array<AccountLocation>>;
  addressEdit: AccountLocation;
  loading: boolean = false;
  message: string = null;

  /**
   * @ignore 
  */
  constructor(private accountLocationService: AccountLocationService, private modalService: BsModalService, private ngZone: NgZone) { }

  /**
   * @ignore 
  */
  ngOnInit() {
    this.loadAddressList();
  }

  /**
   * This will create new address with given input values when clicked save button from Modal template.
   * @param template Modal template editing purpose.
   */
  newAddress(template: TemplateRef<any>) {
    this.addressEdit = new AccountLocation();
    this.message = null;
    this.modalRef = this.modalService.show(template);
  }

  /**
   * @ignore 
  */
  saveAddress(){
    this.ngZone.run(() => this.loading = true);
    this.accountLocationService.saveLocationToAccount(this.addressEdit)
      .subscribe(
        res => {
          this.loading = false;
          this.modalRef.hide();
          this.loadAddressList();
        },
        err => {
          console.error(err);
          this.message = 'Failed to save address. Please contact your administrator.';
          this.loading = false;
        }
      );
  }

  /**
   * Sets default address for logged in user.
   * @param location Account lcoation to set it as default for logged in user.
   */
  setAsDefault(location: AccountLocation){
    this.accountLocationService.setLocationAsDefault(location).subscribe(
      r => {},
      e => console.error(e)
    );
  }

  /**
   * Deletes given address for logged in user.
   * @param location Account location to be deleted for logged in user.
   */
  deleteAddress(location: AccountLocation){
    this.accountLocationService.delete([location]).subscribe(
      r => this.loadAddressList(),
      e => console.error(e)
    );
  }

  /**
   * Updates selected address for logged in user after Save button cliked on modal template.
   * @param location Account location to be updated for logged in user.
   * @param template Modal template editing purpose.
   */
  edit(location: AccountLocation, template: TemplateRef<any>){
    this.addressEdit = location;
    this.modalRef = this.modalService.show(template);
  }

  /**
   * @ignore 
  */
  loadAddressList() {
    this.addressList$ = null;
    this.addressList$ = this.accountLocationService.getAccountLocations();
  }
}
