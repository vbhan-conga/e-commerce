import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { CartService } from '@apttus/ecommerce';
import { TCart } from './models/tier-one.model';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
    `,
  styles: []
})
export class AppComponent {
  title = 'app';
  showHeader: boolean = true;

  constructor(private cartService: CartService) {
    setTheme('bs4'); // or 'bs4'
  }

}

