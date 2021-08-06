import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Transaction} from "../../entity/transaction";
import {TransactionType} from "../../entity/types";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import axios from "axios";

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent implements OnInit {

  form: FormGroup;
  description: string;
  types: TransactionType[] = [];
  selectedType = 1;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) transaction: Transaction) {

    this.description = transaction.description;

    this.form = fb.group({
      description: [transaction.description, Validators.required],
      amount: [transaction.amount, Validators.required],
      type: [transaction.type, Validators.required],
    });

  }

  ngOnInit() {
    this.getTransactionTypes();
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

  getTransactionTypes(): void {
    axios.interceptors.request.use(
      function (request) {
        return request //todo encode request
      }
      , function (error) {
        return Promise.reject(error);
      }
    );

    axios.get(`http://localhost:4210/api/expense/common/transaction-types`, {withCredentials: true})
      .then(response => {
        if (response.data.rows) {
          this.types = response.data.rows;
        }
      }).catch(e => {
    }).finally(() => {
    })
  }
}
