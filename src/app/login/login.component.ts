import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import axios from 'axios';
import {CookieService} from "ngx-cookie-service";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBar: MatSnackBar, private cookieService: CookieService, private router: Router) {
  }

  hide = true;
  login = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  loading = false;
  userLogin = '';
  userPassword = '';

  getLoginError() {
    if (this.login.hasError('required')) {
      return 'You must enter a login';
    }

    return this.login.hasError('login') ? 'Please, input your login' : '';
  }

  getPasswordError() {
    if (this.password.hasError('required')) {
      return 'You must enter a password';
    }

    return this.password.hasError('password') ? 'Please, input your password' : '';
  }

  doLogin(): void {
    if (this.login.hasError('required')) {
      return;
    }
    if (this.password.hasError('required')) {
      return;
    }
    this.loading = true;
    axios.post(`http://localhost:4210/api/expense/auth/login`,'login=' + this.userLogin + '&password=' + this.userPassword,
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
      })
      .then(response => {
        if (!response.data) {
          this.showError('Failed to get data from server. Try again');
          return
        }

        const user = response.data;
        this.cookieService.set('user', JSON.stringify(user));
        this.router.navigate(['/main/dashboard']);

      }).catch(e => {
      this.showError(e.response.data.ERROR.message);
    }).finally(() => {
      this.loading = false;
    })
  }

  showError(message: string) {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5000,
    });
  }
}
