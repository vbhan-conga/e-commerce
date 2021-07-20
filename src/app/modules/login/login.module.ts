import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginLayoutComponent } from './layout/login-layout.component';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    LaddaModule,
    TranslateModule.forChild()
  ],
  declarations: [LoginLayoutComponent]
})
export class LoginModule { }
