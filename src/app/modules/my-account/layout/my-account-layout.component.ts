import { Component, OnInit } from '@angular/core';
import { UserService, User } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';
import { ConfigurationService } from '@apttus/core';

/**
 * Loads all saved layouts for logged-in user profile. One can save UI specific settings as per their preference and use it later. 
 * Different user UI preferences helps different business case.
 */
@Component({
  selector: 'app-my-account-layout',
  templateUrl: './my-account-layout.component.html',
  styleUrls: ['./my-account-layout.component.scss']
})
export class MyAccountLayoutComponent implements OnInit {

  /** An observable object of user type. */
  me$: Observable<User>;
  /** @ignore */
  isAIC: boolean = false;

  /** @ignore */
  constructor(
    private userService: UserService,
    private config: ConfigurationService
    ) { }

  /** @ignore */
  ngOnInit() {
    this.me$ = this.userService.me();
    this.isAIC = this.config.platform() === 'AIC';
  }

}
