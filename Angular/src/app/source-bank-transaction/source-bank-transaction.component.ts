import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import BankTransaction from '../models/bankTransaction';
import Source from '../models/source';

@Component({
  selector: 'app-source-bank-transaction',
  templateUrl: './source-bank-transaction.component.html',
  styleUrls: ['./source-bank-transaction.component.css']
})
export class SourceBankTransactionComponent implements OnInit {

  bankTransaction: BankTransaction;
  sources: Source[];

  transactionForm: FormGroup;
  submitted = false;

  bankColor = '';
  accountColor = '';
  apiResponse = '';
  responseColor = '';
  errors: string[];

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  // retrieve this stored bankTransaction from local-data-service
  // @ bank-transaction-add component init()
  // if null then return back to bank component
  // else store it @ source-bank-transaction component & display 
  // form to input other values for bankTransaction(+)
  // & finally send to data-service for api call
  ngOnInit(): void {
    this.bankTransaction = new BankTransaction();
    this.bankTransaction = this.localDataService.getBankTransaction();
    console.log(this.bankTransaction);

    if (!this.bankTransaction.bankId) {
      this.router.navigate(['/bank']);
    }

    this.bankColor = this.bankTransaction.bankColor;
    this.accountColor = this.bankTransaction.accountColor;

    this.errors = [];
    this.sources = [];

    this.loadSources();

    this.transactionForm = this.fb.group({
      SourceId: ['', Validators.required],
      TransactionAmount: ['', Validators.required],
      TransactionDate: ['', Validators.required]
    });
  }

  // ok
  loadSources() {
    this.dataService.getSources()
      .subscribe(
        data => {
          this.sources = data;
        },
        error => {
          console.log(error);
        });
  }

  resetBankTransaction() {
    this.apiResponse = '';
    this.transactionForm.reset();
    this.transactionForm.get("SourceId").patchValue('');
    this.submitted = false;
    this.errors = [];
    this.responseColor = '';

    // to prevent back history
    this.bankTransaction = new BankTransaction();
    this.localDataService.setBankTransaction(this.bankTransaction);
  }

  // ok
  bankInputFromSource() {
    this.submitted = true;
    if (this.transactionForm.valid) {
      this.bankTransaction.sourceId = Number(this.transactionForm.value["SourceId"]);
      this.bankTransaction.transactionAmount = Number(this.transactionForm.value["TransactionAmount"]);
      this.bankTransaction.transactionDate = new Date(this.transactionForm.value["TransactionDate"].year + '/' + this.transactionForm.value["TransactionDate"].month + '/' + this.transactionForm.value["TransactionDate"].day);

      console.log(this.bankTransaction);

      this.dataService.bankInputFromSource(this.bankTransaction)
        .subscribe(
          response => {

            console.log(response);

            if (response.responseCode == 0) {
              // success    
              this.apiResponse = response.responseMessage;
              this.responseColor = 'green';
              this.errors = [];

              this.transactionForm.reset();
              this.transactionForm.get("SourceId").patchValue('');
              this.submitted = false;

              setTimeout(() => {
                this.router.navigate(['/bank']);
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
            this.bankTransaction = new BankTransaction();
            this.localDataService.setBankTransaction(this.bankTransaction);
          },
          error => {
            this.apiResponse = '';
            this.responseColor = 'red';
            this.errors = [];

            // to prevent back history
            this.bankTransaction = new BankTransaction();
            this.localDataService.setBankTransaction(this.bankTransaction);

            this.errors = this.localDataService.display400andEx(error, 'Source To Bank Transaction');
          }
        );
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
    // to prevent back history
    this.bankTransaction = new BankTransaction();
    this.localDataService.setBankTransaction(this.bankTransaction);

    this.router.navigate(['/bank']);
  }

  // ok
  // disable browser history
  ngOnDestroy() {
    this.bankTransaction = new BankTransaction();
    this.localDataService.setBankTransaction(this.bankTransaction);
  }
}

