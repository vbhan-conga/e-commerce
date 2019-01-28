import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { setTheme } from 'ngx-bootstrap/utils';
import { Title } from '@angular/platform-browser';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ExceptionService } from './services/exception.service';
import { ServiceWorkerService } from './services/service-worker';
import { UserService } from '@apttus/ecommerce';
import { PlatformService } from '@apttus/core';
import { ToastrService } from 'ngx-toastr';

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
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  private subs: Array<any> = [];

  constructor(private titleService: Title, private router: Router, private activatedRoute: ActivatedRoute, private exceptionService: ExceptionService, private sr: ServiceWorkerService, private userService: UserService, private platformService: PlatformService, private toastr: ToastrService) {
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

      this.subs.push(this.platformService.onRefreshHome.subscribe(res => {
        if (res) {
          this.router.navigateByUrl('/');
          localStorage.setItem('Show Toastr', 'true');
          window.location.reload();
        }
      }));
      if (localStorage.getItem('Show Toastr')) {
        if (localStorage.getItem('Show Toastr').valueOf()) {
          this.toastr.warning('This page has been reloaded.', 'Session Expired');
          localStorage.removeItem('Show Toastr');
        }
      }
  }

  ngOnDestroy() {
    if (this.subs.length > 0) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

}

