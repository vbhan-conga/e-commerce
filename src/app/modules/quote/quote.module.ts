import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteRoutingModule } from './quote-routing.module';
import { CreateQuoteComponent } from './layout/quote-create/create-quote.component';
import { RequestQuoteFormComponent } from './component/request-quote-form/request-quote-form.component';
import { TranslateModule } from '@ngx-translate/core'; 
import { PricingModule } from '@apttus/ecommerce';
import { PriceModule, InputSelectModule, BreadcrumbModule, InputFieldModule, AddressModule, IconModule, LineItemTableRowModule, PriceSummaryModule } from '@apttus/elements';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { DetailsModule } from '../details/details.module';
import { QuoteDetailsComponent } from './layout/quote-details/quote-details.component';
import { OutputFieldModule } from '@apttus/elements';
import { LaddaModule } from 'angular2-ladda';
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    QuoteRoutingModule,
    FormsModule,
    PriceModule,
    PricingModule,
    DatepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    InputSelectModule,
    BreadcrumbModule,
    InputFieldModule,
    AddressModule,
    IconModule,
    DetailsModule,
    TranslateModule.forChild(),
    OutputFieldModule,
    LineItemTableRowModule,
    LaddaModule,
    NgScrollbarModule,
    PriceSummaryModule
  ],
  declarations: [CreateQuoteComponent, RequestQuoteFormComponent, QuoteDetailsComponent]
})
export class QuoteModule { }
