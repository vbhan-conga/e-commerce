import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { setTheme } from 'ngx-bootstrap/utils';
import { CartService, CartItemService } from '@apttus/ecommerce';
import { Title } from '@angular/platform-browser';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

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
export class AppComponent implements OnInit {
  title = 'app';
  showHeader: boolean = true;

  constructor(private cartService: CartService, private cartItemService: CartItemService, private titleService: Title, private router: Router, private activatedRoute: ActivatedRoute) {
    setTheme('bs4'); // or 'bs4'
  }

  ngOnInit(){
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .flatMap(r => Observable.combineLatest(r.data, r.params))
      .subscribe(([data, params]) => {
        if(params && Object.keys(params).length > 0)
          this.titleService.setTitle('Apttus: ' + params[Object.keys(params)[0]]);
        else if (_.get(data, 'title'))
          this.titleService.setTitle('Apttus: ' + _.get(data, 'title'));
        else
          this.titleService.setTitle('Apttus: B2B E-commerce');
      });
  }

}

