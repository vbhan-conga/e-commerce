/**
 * Apttus Digital Commerce
 *
 * Dedicated routing module for the Login module.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginLayoutComponent } from './layout/login-layout.component';

const routes: Routes = [
  {
    path: ':orderId',
    component: LoginLayoutComponent
  },
  {
    path: '',
    component: LoginLayoutComponent
  }
];

/**
 * @internal
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
