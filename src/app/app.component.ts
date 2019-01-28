import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { setTheme } from 'ngx-bootstrap/utils';
import { Title } from '@angular/platform-browser';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ExceptionService } from './services/exception.service';
import { ServiceWorkerService } from './services/service-worker';
import { UserService } from '@apttus/ecommerce';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <!--<apt-cr-modal></apt-cr-modal>-->
    <main>
      <router-outlet></router-outlet>
    </main>
    `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private titleService: Title, private router: Router, private activatedRoute: ActivatedRoute, private exceptionService: ExceptionService, private sr: ServiceWorkerService, private userService: UserService) {
    setTheme('bs4'); // or 'bs4'
    sr.initialize();
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

