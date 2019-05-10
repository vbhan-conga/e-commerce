import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsLayoutComponent } from './layout/details-layout.component';

const routes: Routes = [
  {
    path : '',
    component : DetailsLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsRoutingModule { }