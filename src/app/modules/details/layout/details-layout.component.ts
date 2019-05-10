import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderService } from '@apttus/ecommerce';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

/**
 * Details Layout Component shows the details of the placed order.
 */

@Component({
  selector: 'app-details',
  templateUrl: './details-layout.component.html',
  styleUrls: ['./details-layout.component.scss']
})
export class DetailsLayoutComponent implements OnInit {

  item$: Observable <Order>;
  name: string;  

  @ViewChild ('summary') summary: ElementRef;
  @ViewChild ('lineItems') lineItems: ElementRef;

  /**
     * HostListener Decorator a DOM event to listen for, and provides a handler method to run when that 
     * event occurs. Here attaches listener to window on scroll event.
     * In onScroll method assigns headerClass property with the class "'fixed-top' | 'fixed-top expand'" based on window 
     * pageYOffset and set the tab active.
     */
    @HostListener('window:scroll', ['$event'])
    onScroll(event) {
        if (this.headerClass != null && window.pageYOffset < 85) {
            this.headerClass = 'fixed-top expand';
            setTimeout(() => this.headerClass = null, 200);
        } else if (window.pageYOffset >= 85) {
            this.headerClass = 'fixed-top';
        } else {
            this.headerClass = null;
        }

        this.setActiveTab(window.pageYOffset);
    }
    headerClass: 'fixed-top' | 'fixed-top expand' = null;

    /**
     * List of tabs to be displayed on details layout page.
     */
    tabList: Array<DetailTab>;
    private activeTabIndex = 0;
    private headerHeight = 200;

  constructor(private route: ActivatedRoute, private orderService: OrderService) { }

  ngOnInit() {
    this.route.params
      .subscribe(r => {
        if(r.id && r.id.indexOf('O-') === 0)
          this.item$ =  this.orderService.getOrderByName(r.id);
          this.name = r.id;
      });
    setTimeout(() => this.buildTabs(), 100);
  }

  /**
   * scrollTo method scrolls the page to the specified tab content.
   */
  scrollTo(tab: DetailTab) {
    if (tab.section)
        window.scrollTo({ top: tab.section.nativeElement.offsetTop - this.headerHeight, left: 0, behavior: 'smooth' });
    setTimeout(() => {
        this.tabList.forEach(t => t.active = false);
        tab.active = true;
        this.activeTabIndex = _.findIndex(this.tabList, t => t.label === tab.label);
    }, 500);
  }

  setActiveTab(windowPosition) {
    let index = 0;
    if (this.tabList) {
        this.tabList.forEach((tab, idx) => {
            if (tab.section != null && windowPosition + (this.headerHeight * 1.5) >= tab.section.nativeElement.offsetTop)
                index = idx;
        });

        if (index !== this.activeTabIndex) {
            this.tabList.forEach(t => t.active = false);
            this.tabList[index].active = true;
            this.activeTabIndex = index;
        }
    }
  }

    /**
     * List of tabs to be displayed for details page.
     * Here the tabs are referring to DetailTab interface.
     */
    buildTabs() {
      this.tabList = _.orderBy([
          {
              label: 'ORDER SUMMARY',
              active: false,
              section: this.summary,
              showLabel: true
          },
          {
              label: 'LINE ITEMS',
              active: true,
              section: this.lineItems,
              showLabel: true
          }
      ], 'section.nativeElement.offsetTop');
  }

}

export interface DetailTab {
  label: string;
  active: boolean;
  section: ElementRef;
  showLabel: boolean;
}