/**
 * Apttus Digital Commerce
 *
 * Dedicated routing module for the home module.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './layout/home.component';
import { HomeResolver } from './services/home.resolver';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            state: HomeResolver
        }
    }
];

/**
 * @internal
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
