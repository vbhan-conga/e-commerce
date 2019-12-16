/**
 * Apttus Digital Commerce
 *
 * Dedicated routing module for the manage cart module.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageCartComponent } from './layout/manage-cart.component';
import { ManageCartResolver } from './services/manage-cart.resolver';

const routes: Routes = [
  {
    path: 'active',
    component: ManageCartComponent
  }
];

/**
 * @internal
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCartRoutingModule {}
