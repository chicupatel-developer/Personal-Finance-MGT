import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { DataService } from '../services/data.service';
import Bank from '../models/bank';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Account from '../models/account';
import { ActivatedRoute, Router } from '@angular/router';
import BankAccountVM from '../models/bankAccountVM';
import BankTransaction from '../models/bankTransaction';
import AccountType from '../models/accountType';
import AccountVM from '../models/accountVM';
import Transaction from '../models/transaction';
import AccountStatement from '../models/accountStatement';
import PayeeType from '../models/payeeType';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-bank-account-list',
  templateUrl: './bank-account-list.component.html',
  styleUrls: ['./bank-account-list.component.css']
})
export class BankAccountListComponent implements OnInit {

  isDataAvailable: boolean = false;

  accountStatement: AccountStatement;
  transactions: Transaction[];

  accountTypesName: string[];
  accountTypesCollection: AccountType[];

  payeeTypesName: string[];
  payeeTypesCollection: PayeeType[];

  bankTransaction: BankTransaction;

  bankAccounts: BankAccountVM;

  bankColor = '';
  accountColor = '';

  apiResponse = '';
  responseColor = '';
  errors: string[];

  constructor(public datepipe: DatePipe, public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  // ok
  ngOnInit() {
    this.accountStatement = new AccountStatement();
    this.transactions = [];
    this.accountStatement.transactions = this.transactions;

    this.errors = [];
    this.bankColor = '';
    this.accountColor = '';

    this.accountTypesName = [];
    this.accountTypesCollection = [];

    this.payeeTypesName = [];
    this.payeeTypesCollection = [];

    this.bankTransaction = new BankTransaction();

    this.bankAccounts = new BankAccountVM();

    this.bankAccounts.bankId = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(+this.bankAccounts.bankId)) {
      console.log('Not a Number!');
      this.router.navigate(['/bank']);
    }
    else {
      this.loadPayeeTypes();
      this.loadAccountTypes();

      // prepare for bank-transaction-begin-add process
      this.bankTransaction.bankId = this.bankAccounts.bankId;

      // do api call to retrieve latest bank's account information 
      this.dataService.getBankAccounts(this.bankAccounts.bankId)
        .subscribe(
          data => {
            this.apiResponse = '';
            this.responseColor = 'green';
            this.errors = [];

            this.bankAccounts = data;
            if (data.bankName != null) {
              this.bankColor = this.localDataService.getBankColor(this.bankAccounts.bankName);

              // accounts sort by accountType
              this.bankAccounts.accounts.sort((a, b) => String(a.accountType).localeCompare((String)(b.accountType)));
            }
            else {
              this.apiResponse = 'Bank Not Found !';
              this.responseColor = 'red';
              this.errors = [];
            }
          },
          error => {
            this.apiResponse = '';
            this.responseColor = 'red';
            this.errors = [];
          });
    }
  }

  // ok
  loadAccountTypes() {
    this.dataService.getAccountTypes()
      .subscribe(
        data => {
          this.accountTypesName = data;
          this.accountTypesCollection = this.localDataService.getAccountTypeCollection(this.accountTypesName);

          this.isDataAvailable = true;
        },
        error => {
          console.log(error);
        });
  }
  // ok
  // convert int to string from AccountType[]
  displayAccountType(acType) {
    var filterByAccountType = this.accountTypesCollection.filter(xx => xx.indexValue == acType);
    if (filterByAccountType != null) {
      return filterByAccountType[0].accountType;
    }
    else {
      return -1;
    }
  }

  // ok
  loadPayeeTypes() {
    this.dataService.getPayeeTypes()
      .subscribe(
        data => {
          this.payeeTypesName = data;
          this.payeeTypesCollection = this.localDataService.getPayeeTypeCollection(this.payeeTypesName);
        },
        error => {
          console.log(error);
        });
  }
  // ok
  displayPayeeType(payeeType) {
    if (this.payeeTypesCollection != null) {
      return this.payeeTypesCollection[payeeType].payeeType;
    }
    else {
      return 0;
    }
  }

  // ok
  goBack() {
    this.router.navigate(['/bank']);
  }

  // ok
  prepareBankTransactionObject(account){
    this.bankTransaction.accountId = account.accountId;
    this.bankTransaction.accountNumber = account.accountNumber;
    this.bankTransaction.bankColor = this.bankColor;
    this.bankTransaction.accountColor = this.localDataService.getAccountTypeColor(account.accountType);
    this.bankTransaction.bankName = this.bankAccounts.bankName;
    this.bankTransaction.balance = account.balance;

    // store this bankTransaction to local-data-service
    this.localDataService.setBankTransaction(this.bankTransaction);
  }
  // ok
  bankTransactionBeginAdd(account) {
    this.prepareBankTransactionObject(account);

    // redirect to bank-transaction-add 
    this.router.navigate(['/bank-transaction-add']);
  }

  // ok
  getAccountStatementAll(account) {    
    var accountVM = new AccountVM();
    accountVM.accountId = account.accountId;

    this.dataService.getAccountStatementAll(accountVM)
      .subscribe(
        response => {

          console.log(response);

          if (response.accountId) {
            // success       
            this.apiResponse = '';
            this.responseColor = 'green';
            this.errors = [];

            // popup display name for account-type
            // popup display name for payee-type
            this.accountStatement = response;
            this.accountStatement.accountTypeDisplay = (String)(this.displayAccountType(this.accountStatement.accountType));
            this.accountStatement.transactions.forEach((element) => {
              element.payeeTypeDisplay = (String)(this.displayPayeeType(element.payeeType));
              element.transactionTypeDisplay = this.localDataService.getTransactionType(element.transactionType);
            });
            // store accountStatement @ local-data-service & redirect
            // to account-statement-all component
            this.localDataService.setAccountStatement(response);

            setTimeout(() => {
              this.router.navigate(['/account-statement-all']);
            }, 2000);
          }
          else if (response.responseCode == -1) {
            // server error
            // server exception
            this.apiResponse = response.responseCode + ' : ' + response.responseMessage;
            this.responseColor = 'red';
            this.errors = [];
          }
        },
        error => {
          this.apiResponse = '';
          this.responseColor = 'red';
          this.errors = [];
          this.errors = this.localDataService.display400andEx(error, 'Account-Statement');
        }
      );
  }

  // ok
  bankInputFromSource(account){
    this.prepareBankTransactionObject(account);

    // redirect to source-bank-transaction
    this.router.navigate(['/source-bank-transaction']);
  }
}
