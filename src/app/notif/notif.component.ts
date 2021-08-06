import {Component, OnInit} from '@angular/core';
import axios from "axios";
import {CookieService} from "ngx-cookie-service";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {Router} from "@angular/router";
import {Notification} from '../../entity/notification';

@Component({
  selector: 'app-notif',
  templateUrl: './notif.component.html',
  styleUrls: ['./notif.component.scss']
})
export class NotifComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  unreadNotifications: Notification[] = [];

  constructor(private _snackBar: MatSnackBar, private cookieService: CookieService, private router: Router) {
  }

  ngOnInit(): void {
    this.getUnreadNotifications();
  }

  getUnreadNotifications(): void {
    axios.interceptors.request.use(
      function (request) {
        return request //todo encode request
      }
      , function (error) {
        return Promise.reject(error);
      }
    );


    axios.get(`http://localhost:4210/api/expense/common/notifications`, {withCredentials: true})
      .then(response => {
        if (response.data.rows) {
          this.unreadNotifications = response.data.rows;
        }
      }).catch(e => {
      if (e.response.data.ERROR.status == 401) {
        this.router.navigate(['/login']);
        this.cookieService.delete("user");
      }
      this.showError(e.response.data.ERROR.message);
    }).finally(() => {
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
