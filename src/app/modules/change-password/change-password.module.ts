import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordLayoutComponent } from './layout/change-password-layout.component';

import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    FormsModule,
    LaddaModule,
    TranslateModule.forChild()
  ],
  declarations: [ChangePasswordLayoutComponent]
})
export class ChangePasswordModule { }
