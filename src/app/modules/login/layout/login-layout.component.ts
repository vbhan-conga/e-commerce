import { Component } from '@angular/core';
import { UserService } from '@apttus/ecommerce';
import { CacheService } from '@apttus/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

/**
 * Login Layout component is used to get the user details and verify it with connected org.
 *
 * @example
 * <app-login-layout></app-login-layout>
 */
@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})

export class LoginLayoutComponent {
  /**
   * Username required for login
   */
  username: string;
  /**
   * Password is case sensitive and non-readable format for login
   */
  password: string;
  /**
   * Flag used to show/hide loader
   */
  loading: boolean = false;
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService, private translateService: TranslateService, private activatedRoute: ActivatedRoute, private cacheService: CacheService) { }

  /**
   * This method will check user authenthicity based on given details
   */
  login() {
    this.loading = true;
    /**UserService is used to verify the user and update user details for further use. */
    this.userService.login(this.username, this.password).subscribe(
      () => {
        this.loading = false;
        this.cacheService.refresh(this.userService.type);
        (_.get(this.activatedRoute.snapshot.params,'orderId')) ? this.router.navigate(['/Orders', _.get(this.activatedRoute.snapshot.params,'orderId')]) : this.router.navigate(['/']);
      },
      (e) => {
        this.loading = false;
        this.translateService.stream(['LOGIN.INCORRECT_CREDENTIALS_TOASTR_MESSAGE', 'LOGIN.INCORRECT_CREDENTIALS_TOASTR_TITLE']).subscribe((val: string) => {
          this.toastr.error(val['LOGIN.INCORRECT_CREDENTIALS_TOASTR_MESSAGE'], val['LOGIN.INCORRECT_CREDENTIALS_TOASTR_TITLE']);
        });
      }
    );
  }

}
