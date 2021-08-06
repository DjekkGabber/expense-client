import {Component, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'expense-app';
  user = '';

  constructor(private cookieService: CookieService, private router: Router) {
  }

  ngOnInit(): void {
    this.user = this.cookieService.get('user');
    if (this.user == null || this.user == '') {
      this.router.navigate(['/login']);
    }
  }
}
