import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import CreditCardTransaction from '../models/creditCardTransaction';
import PayeeType from '../models/payeeType';
import Payee from '../models/payee';

@Component({
  selector: 'app-credit-card-transaction',
  templateUrl: './credit-card-transaction.component.html',
  styleUrls: ['./credit-card-transaction.component.css']
})
export class CreditCardTransactionComponent implements OnInit {

  ccTransaction: CreditCardTransaction;
  payees: Payee[];

  transactionForm: FormGroup;
  submitted = false;

  ccColor = '';
  apiResponse = '';
  responseColor = '';
  errors: string[];

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.ccTransaction = new CreditCardTransaction();
    this.ccTransaction = this.localDataService.getCCTransaction();
    if (!this.ccTransaction.creditCardId) {
      this.router.navigate(['/creditcard']);
    }

    this.ccColor = this.ccTransaction.ccColor;

    this.errors = [];
    this.payees = [];

    this.loadPayees();    

    this.transactionForm = this.fb.group({
      PayeeId: ['', Validators.required],
      TransactionAmount: ['', Validators.required],
      TransactionDate: ['', Validators.required]
    });
  }

  // ok
  loadPayees() {
    this.dataService.listOfPayees()
      .subscribe(
        data => {
          this.payees = data;
          this.payees = this.payees.filter(xx => xx.payeeType != 3);          
        },
        error => {
          console.log(error);
        });
  }

  resetCCTransaction() {
    this.apiResponse = '';
    this.transactionForm.reset();
    this.transactionForm.get("PayeeId").patchValue('');
    this.submitted = false;
    this.errors = [];
    this.responseColor = '';

    // to prevent back history
    this.ccTransaction = new CreditCardTransaction();
    this.localDataService.setCCTransaction(this.ccTransaction);
  }

  addCCTransaction() {
    this.submitted = true;
    if (this.transactionForm.valid) {
      this.ccTransaction.payeeId = Number(this.transactionForm.value["PayeeId"]);
      this.ccTransaction.transactionAmount = Number(this.transactionForm.value["TransactionAmount"]);
      this.ccTransaction.transactionDate = new Date(this.transactionForm.value["TransactionDate"].year + '/' + this.transactionForm.value["TransactionDate"].month + '/' + this.transactionForm.value["TransactionDate"].day);

      console.log(this.ccTransaction);

      /*
      this.dataService.addCCTransaction(this.ccTransaction)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success    
              this.apiResponse = response.responseMessage;
              this.responseColor = 'green';
              this.errors = [];

              this.transactionForm.reset();
              this.transactionForm.get("PayeeId").patchValue('');
              this.submitted = false;

              setTimeout(() => {
                this.router.navigate(['/creditcard']);
                this.apiResponse = '';
              }, 3000);
            }
            else {
              // server error
              this.apiResponse = response.responseCode + ' : ' + response.responseMessage;
              this.responseColor = 'red';

              this.errors = [];
            }
            // to prevent back history
            this.ccTransaction = new CreditCardTransaction();
            this.localDataService.setCCTransaction(this.ccTransaction);
          },
          error => {
            this.apiResponse = '';
            this.responseColor = 'red';
            this.errors = [];

            // to prevent back history
            this.ccTransaction = new CreditCardTransaction();
            this.localDataService.setCCTransaction(this.ccTransaction);

            this.errors = this.localDataService.display400andEx(error, 'Credit-Card-Transaction');
          }
        );
        */
    }
  }

  // ok
  public handleError = (controlName: string, errorName: string) => {
    return this.transactionForm.controls[controlName].hasError(errorName);
  }

  // ok
  get transactionFormControl() {
    return this.transactionForm.controls;
  }

  // ok
  goBack() {
    this.ccTransaction = new CreditCardTransaction();
    this.localDataService.setCCTransaction(this.ccTransaction);
    this.router.navigate(['/creditcard']);
  }

  // ok
  // disable browser history
  ngOnDestroy() {
    this.ccTransaction = new CreditCardTransaction();
    this.localDataService.setCCTransaction(this.ccTransaction);
  }
}
