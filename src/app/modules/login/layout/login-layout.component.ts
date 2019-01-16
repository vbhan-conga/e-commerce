import { Component, OnInit } from '@angular/core';
import { UserService } from '@apttus/ecommerce';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})
export class LoginLayoutComponent implements OnInit {
  username: string;
  password: string;
  loading: boolean = false;
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

  login(){
    this.loading = true;
    this.userService.login(this.username, this.password).subscribe(
      () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      (e) => {
        this.loading = false;
        this.toastr.error('Your username or password is incorrect.', 'Login Fail');
      }
    );
  }

}
