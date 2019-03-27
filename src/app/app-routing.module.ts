import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuard } from './services/route.guard';
import { ConstraintRuleGuard } from './services/constraint-rule.guard';
import { AuthGuard } from './services/auth.guard';
import { AboGuard } from './services/aboGuard';

const routes: Routes = [
  { path: 'ChangePassword', loadChildren: './modules/change-password/change-password.module#ChangePasswordModule', data: { title: 'Change Password' }},
  { path: '', loadChildren: './modules/home/home.module#HomeModule', data: { title: 'B2B E-commerce' } },
  { path: 'product', loadChildren: './modules/product-details/product-details.module#ProductDetailsModule', data: { title: 'Product' } },
  { path: 'compare', loadChildren: './modules/compare/compare.module#CompareModule', data: { title: 'Product Comparison' } },
  { path: 'product-list', loadChildren: './modules/product-list/product-list.module#ProductListModule', data: { title: 'Product List' } },
  { path: 'installed-products', canActivate: [RouteGuard, AuthGuard, AboGuard], loadChildren: './modules/installed-products/installed-products.module#InstalledProductsModule', data: { title: 'Installed Products' } },
  { path: 'search/:query', loadChildren: './modules/product-list/product-list.module#ProductListModule', data: { title: 'Search' } },
  { path: 'cart', loadChildren: './modules/cart/cart.module#CartModule', canActivate: [RouteGuard, ConstraintRuleGuard], data: { title: 'Checkout' } },
  { path: 'my-account', loadChildren: './modules/my-account/my-account.module#MyAccountModule', data: { title: 'My Account' }, canActivate: [AuthGuard] },
  { path: 'manage-cart', loadChildren: './modules/manage-cart/manage-cart.module#ManageCartModule', data: { title: 'Cart' } },
  { path: 'login', loadChildren: './modules/login/login.module#LoginModule', data: { title: 'Login'}},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
