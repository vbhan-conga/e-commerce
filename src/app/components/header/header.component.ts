import { Component, OnInit, HostListener, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Storefront, StorefrontService, UserService, User } from '@apttus/ecommerce';
import { MiniProfileComponent } from '@apttus/elements';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @ViewChild('profile', { static: false }) profile: MiniProfileComponent;

  pageTop: boolean = true;
  modalRef: BsModalRef;

  storefront$: Observable<Storefront>;
  user$: Observable<User>;

  constructor(private storefrontService: StorefrontService,
    private userService: UserService,
    private router: Router) {}

  ngOnInit() {
    this.storefront$ = this.storefrontService.getStorefront();
    this.user$ = this.userService.me();
  }

  doLogout() {
    this.profile.doLogout();
    this.router.navigate(['/']);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.pageTop = window.pageYOffset <= 0;
  }
}
