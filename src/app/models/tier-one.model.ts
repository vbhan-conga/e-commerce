import { SObjectModel, ChildRecord } from 'ng-salesforce';
import { ProductAttributeValue, CartItem, Cart } from '@apttus/ecommerce';

@SObjectModel({
    name: 'Apttus_Config2__ProductAttributeValue__c'
})
export class TProductAttributeValue extends ProductAttributeValue {
    Availability_Level__c: string = null;
    Initial_Storage_Capacity_TB__c: number = null;
    Number_of_Users__c: string = null;
    Response_Time__c: string = null;
    Solution__c: string = null;
    Solution_Category__c: string = null;
}

export class TCartItem extends CartItem {
    Apttus_Config2__AttributeValueId__r = new TProductAttributeValue();
    Apttus_Config2__ProductAttributeValues__r: ChildRecord = new ChildRecord(new TProductAttributeValue(true, false));
}

export class TCart extends Cart {
    Apttus_Config2__LineItems__r: ChildRecord = new ChildRecord(new TCartItem(true, false));
}