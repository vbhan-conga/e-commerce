import { AObjectService, ACondition } from '@apttus/core';

import { ProductInformation } from '@apttus/ecommerce';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

/**
 * The Product Information service is a way to find the attachments associated with a product
 */
@Injectable({
    providedIn: 'root'
})
export class ProductInformationService extends AObjectService {

    type = ProductInformation;  

    /**
     * Method is used to retrieve the list of production information items with attachments for a given product.
     *
     * @param productId the id of the product to return the product inoformation items for
     * @returns an observable containing the product information details for the given product
     */
    public getProductInformation(productId: string): Observable<ProductInformation[]> {
        if (!productId)
            return Observable.of([]);
        else {
            return this.where(
                [new ACondition(this.type, 'ProductId', 'Equal', productId)]
            );        
        }        
    }
}