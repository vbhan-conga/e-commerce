import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeState, HomeResolver } from '../services/home.resolver';
import { Observable } from 'rxjs';


/**
 * Default Home/Landing componenet for Apttus Digital Commerce.
 * Shows Storefront image(s), products from first two categories of price list and Footer
 *
 * @example
 * <app-home></app-home>
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public view$: Observable<HomeState>;

  constructor(public sanitizer:DomSanitizer, private resolver: HomeResolver) {}

  ngOnInit() {
    this.view$ = this.resolver.state();
  }

}
