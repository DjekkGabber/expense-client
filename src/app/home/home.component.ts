import {Component, ViewChild, AfterViewInit, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import axios from "axios";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {Transaction} from "../../entity/transaction";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {AddDialogComponent} from "../add-dialog/add-dialog.component";

export interface DialogData {
  type: number;
  description: string;
  amount: number;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  tableData: Transaction[] = [];
  displayedColumns: string[] = ['type', 'amount', 'description', 'creation_date'];
  resultsLength = 0;
  loading = false;
  pageSize = 20;
  pageSizeOptions: number[] = [20, 50, 100];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private cookieService: CookieService, private router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getMyTransactions();
    }, 0);
  }

  getMyTransactions(): void {
    this.loading = true;
    axios.interceptors.request.use(
      function (request) {
        return request //todo encode request
      }
      , function (error) {
        return Promise.reject(error);
      }
    );


    axios.get(`http://localhost:4210/api/expense/common/my-transactions` + '?perPage=' + this.pageSize +
      '&page=' + this.paginator?.pageIndex, {withCredentials: true})
      .then(response => {
        if (response.data.rows) {
          this.tableData = response.data.rows;
        }
      }).catch(e => {
      if (e.response.data.ERROR.status == 401) {
        this.router.navigate(['/login']);
        this.cookieService.delete("user");
      }
    }).finally(() => {
      this.loading = false;
    })
  }

  addExpense(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      type: null,
      description: '',
      amount: 0
    };

    const dialogRef = this.dialog.open(AddDialogComponent,
      dialogConfig);


    dialogRef.afterClosed().subscribe(
      val => {
        console.log("Dialog output:", val)
        if (val) {
          this.saveData(val);
        }
      }
    );
  }

  saveData(transact: Transaction): void {
    this.loading = true;
    axios.interceptors.request.use(
      function (request) {
        return request //todo encode request
      }
      , function (error) {
        return Promise.reject(error);
      }
    );


    axios.post(`http://localhost:4210/api/expense/common/my-transactions/add`, {
      amount: transact.amount,
      type: transact.type,
      description: transact.description
    }, {withCredentials: true})
      .then(response => {
        if (response.data) {
          this.getMyTransactions();
        }
      }).catch(e => {
      this.showError(e.response.data.ERROR.message);
      if (e.response.data.ERROR.status == 401) {
        this.router.navigate(['/login']);
        this.cookieService.delete("user");
      }
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
