import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from '@apttus/ecommerce';
import { Router } from '@angular/router';

/**
 * Change password component, takes new password and update with old
 * 
 * @example
 * <app-change-password-layout></app-change-password-layout>
 */

 /**
  * Prevents compile time type error checking from flagging the call as invalid.
  */
const sv = (<any>window).sv;

@Component({
  selector: 'app-change-password-layout',
  templateUrl: './change-password-layout.component.html',
  styleUrls: ['./change-password-layout.component.scss']
})
export class ChangePasswordLayoutComponent {

  /**
   * Different messages depending on the state of component
   * e.g. PasswordA and PasswordB doesn't match, Reusing old password, some errors/exceptions
   */
  message: string;
  /**
   * Change Password form model consisting PasswordA and PasswordB fields
   */
  passwordForm: PasswordForm = {} as PasswordForm;
  /**
   * Shows/Hides Spinner when LoadingStarts/LoadingEnds
   */
  loading: boolean = false;

  constructor(private userService: UserService, private router: Router, private ngZone: NgZone) { }


  /**
   * Takes two password from form inputs, compares them if match is found
   * calls user service's setPassword(newPassword) and changes password for user.
   * Shows error if there are any
   */
  setPassword(){
    if(this.passwordForm.passwordA !== this.passwordForm.passwordB)
      this.message = 'Your passwords do not match';
    else{
      this.loading = true;
      this.userService.setPassword(this.passwordForm.passwordA).subscribe(
        res => this.ngZone.run(() => {
          this.loading = false;
          if(sv && sv.params)
            sv.params = null;
            this.router.navigate(['']);
        }),
        err => this.ngZone.run(() => {
          if(err.indexOf('invalid repeated password') >= 0)
            this.message = 'Cannot reuse this old password.';
          else
            this.message = 'An error ocurred. Please contact your administrator.';
          this.loading = false;
        })
      );
    }
  }
}

export interface PasswordForm{
  passwordA: string;
  passwordB: string;
}
