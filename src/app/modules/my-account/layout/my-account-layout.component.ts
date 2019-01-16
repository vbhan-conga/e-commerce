import { Component, OnInit } from '@angular/core';
import { UserService, User } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';
import { ConfigurationService } from '@apttus/core';

@Component({
  selector: 'app-my-account-layout',
  templateUrl: './my-account-layout.component.html',
  styleUrls: ['./my-account-layout.component.scss']
})
export class MyAccountLayoutComponent implements OnInit {

  me$: Observable<User>;
  isAIC: boolean = false;

  constructor(
    private userService: UserService,
    private config: ConfigurationService
    ) { }

  ngOnInit() {
    this.me$ = this.userService.me();
    this.isAIC = this.config.platform() === 'AIC';
  }

}
