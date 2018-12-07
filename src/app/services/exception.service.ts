import { Injectable } from '@angular/core';
import { CartService, CartError } from '@apttus/ecommerce';
import { ToastrService } from 'ngx-toastr';

const ErrorMap = {
    TOO_MANY_ATTEMPTS: 'Oops something went wrong.',
    SERVER_ERROR: 'Oops something went wrong.',
    PRICE_CHANGE : 'The price of your cart has been updated'
};


@Injectable({providedIn : 'root'})
export class ExceptionService{

    constructor(private cartService: CartService, private toastr: ToastrService){

        this.cartService.onCartError.subscribe((e: CartError) => {
            if (e === CartError.TOO_MANY_ATTEMPTS)
                this.toastr.error(ErrorMap.TOO_MANY_ATTEMPTS, 'Cart Error');
            else if(e === CartError.SERVER_ERROR)
                this.toastr.error(ErrorMap.SERVER_ERROR, 'Cart Error');
        });


        this.cartService.onCartPriceError.debounceTime(200).subscribe((e: CartError) => this.toastr.warning(ErrorMap.PRICE_CHANGE, 'Price Update'));
    }

}