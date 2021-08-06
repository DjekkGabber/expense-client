import {Component, OnInit} from '@angular/core';
import {User} from "../../entity/user";
import {CookieService} from "ngx-cookie-service";
import {Transaction} from "../../entity/transaction";
import axios from "axios";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {

  user: any;

  constructor(private cookieService: CookieService, private router: Router) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.user = JSON.parse(this.cookieService.get("user"));
  }

  logOut() {
    axios.interceptors.request.use(
      function (request) {
        return request //todo encode request
      }
      , function (error) {
        return Promise.reject(error);
      }
    );


    axios.post(`http://localhost:4210/api/expense/auth/logout`, {}, {withCredentials: true})
      .then(response => {
        this.cookieService.delete('user');
        this.router.navigate(['/login']);
      }).catch(e => {
    }).finally(() => {
    })
  }

}
