import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import AccountStatement from '../models/accountStatement';
import AccountType from '../models/accountType';
import PayeeType from '../models/payeeType';
import Transaction from '../models/transaction';
import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

// child component
import { AccountTransactionComponent } from '../account-transaction/account-transaction.component';

@Component({
  selector: 'app-account-statement-all',
  templateUrl: './account-statement-all.component.html',
  styleUrls: ['./account-statement-all.component.css']
})
export class AccountStatementAllComponent implements OnInit {

  // to child component
  childTransactions: Transaction[];

  // date comparision
  invalidEndDate = false;  

  bufferTransactions: Transaction[];

  // group by[]
  groupByCollection: string[] = ['TransactionDate', 'PayeeName'];
  
  // transactions group by date
  transactionsDateGrp: Transaction[];

  // account statement
  transactions: Transaction[];
  accountStatement: AccountStatement;
  
  dateRangeForm: FormGroup;
  submitted = false;

  startDate: Date;
  endDate: Date;

  constructor(public datepipe: DatePipe,private fb: FormBuilder, public localDataService: LocalDataService, public dataService: DataService, private router: Router, private route: ActivatedRoute)
  { 
  }

  ngOnInit(): void {  

    // to child component
    this.childTransactions = [];

    this.invalidEndDate = false;

    this.bufferTransactions = [];

    // transactions group by date
    this.transactionsDateGrp = [];

    //init account statement
    this.transactions = [];
    this.accountStatement = new AccountStatement();
    this.accountStatement.transactions = this.transactions;

    // retrieve accountStatement from local-data-service
    this.accountStatement = this.localDataService.getAccountStatement();
    if(!this.accountStatement.accountId){
      this.router.navigate(['/bank']);
    }

    this.dateRangeForm = this.fb.group({
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      GroupBy: ['']
    });

    // to child component
    this.accountStatement.transactions.forEach((element) => {
      this.childTransactions.push(element);
    });
  }  

  // ok
  get dateRangeFormControl() {
    return this.dateRangeForm.controls;
  }

  // ok
  getAccountStatementDateRange(){
    this.submitted = true;
    if (this.dateRangeForm.valid) {    
      this.startDate = new Date(this.dateRangeForm.value["StartDate"].year + '/' + this.dateRangeForm.value["StartDate"].month + '/' + this.dateRangeForm.value["StartDate"].day);
      this.endDate = new Date(this.dateRangeForm.value["EndDate"].year + '/' + this.dateRangeForm.value["EndDate"].month + '/' + this.dateRangeForm.value["EndDate"].day);

      // check dates
      if (this.endDate.getTime() > this.startDate.getTime()) {
        console.log('date ok!');
        this.invalidEndDate = false;
      }
      else {
        console.log('date not ok!');
        this.submitted=false;
        this.invalidEndDate = true;
        // reset child transactions
        this.childTransactions = [];
        return;
      }
      // convert 2021-07-05T05:00:00 to 2021-07-05T00:00:00
      this.childTransactions = [];
      this.accountStatement.transactions.forEach((element) => {
        var date1 = new Date(element.transactionDate);
        date1.setHours(0, 0, 0, 0);
        // 2021-07-05T00:00:00
        if(date1 >= this.startDate &&  date1 <= this.endDate){
          this.childTransactions.push(element);
        }
      });
    }
  }
  
  // ok
  getAccountStatementAll()
  {
    this.dateRangeForm.reset();
    this.submitted = false;
    this.dateRangeForm.get("GroupBy").patchValue('');
    this.invalidEndDate = false;

    this.childTransactions = [];
    this.accountStatement.transactions.forEach((element) => {
      this.childTransactions.push(element);
    });
  }

  // ok
  goBack() {
    this.transactions = [];
    this.accountStatement = new AccountStatement();
    this.accountStatement.transactions = this.transactions;
    this.localDataService.setAccountStatement(this.accountStatement);

    this.router.navigate(['/bank']);
  }

  // ok
  updateTrList(event){
    if (event.target.value =='TransactionDate')
      this.groupByTransactionDate();
    else if (event.target.value == 'PayeeName')
      this.groupByPayeeName();
    else
      this.groupByDefaultTrId();
  }
  // ok
  groupByDefaultTrId() {
    // x-fer original to temp
    this.bufferTransactions = [];
    this.accountStatement.transactions.forEach((element) => {
      this.bufferTransactions.push(element);
    });

    this.transactionsDateGrp = [];
    this.childTransactions = [];

    // edit property transactionDateString
    this.bufferTransactions.forEach((element) => {
      element.transactionDateString = this.datepipe.transform(element.transactionDate, 'yyyy-MM-dd');
    });
    
    this.bufferTransactions = this.bufferTransactions.reduce(function (r, a) {
      r[a.bankTransactionId] = r[a.bankTransactionId] || [];
      r[a.bankTransactionId].push(a);
      return r;
    }, Object.create(null));

    for (const [key, value] of Object.entries(this.bufferTransactions)) {
      this.transactionsDateGrp.push(value);
    }

    for (var key in this.transactionsDateGrp) {
      if (!this.transactionsDateGrp.hasOwnProperty(key)) continue;

      var obj = this.transactionsDateGrp[key];
      for (var prop in obj) {
        if (!obj.hasOwnProperty(prop)) continue;
        this.childTransactions.push(obj[prop]);
      }
    }
  }
  // ok
  groupByPayeeName() {
    // x-fer original to temp
    this.bufferTransactions = [];
    this.accountStatement.transactions.forEach((element) => {
      this.bufferTransactions.push(element);
    });

    this.transactionsDateGrp = [];
    this.childTransactions = [];

    // edit property transactionDateString
    this.bufferTransactions.forEach((element) => {
      element.transactionDateString = this.datepipe.transform(element.transactionDate, 'yyyy-MM-dd');
    });

    this.bufferTransactions = this.bufferTransactions.reduce(function (r, a) {
      r[a.payeeName] = r[a.payeeName] || [];
      r[a.payeeName].push(a);
      return r;
    }, Object.create(null));

    for (const [key, value] of Object.entries(this.bufferTransactions)) {
      this.transactionsDateGrp.push(value);
    }

    for (var key in this.transactionsDateGrp) {
      if (!this.transactionsDateGrp.hasOwnProperty(key)) continue;

      var obj = this.transactionsDateGrp[key];
      for (var prop in obj) {
        if (!obj.hasOwnProperty(prop)) continue;
        this.childTransactions.push(obj[prop]);
      }
    }
  }
  // ok
  groupByTransactionDate() { 
    // x-fer original to temp
    this.bufferTransactions = [];
    this.accountStatement.transactions.forEach((element) => {
      this.bufferTransactions.push(element);
    });

    this.transactionsDateGrp = [];
    this.childTransactions = [];

    // edit property transactionDateString
    this.bufferTransactions.forEach((element) => {
      element.transactionDateString = this.datepipe.transform(element.transactionDate, 'yyyy-MM-dd');
    });

    // group by on property transactionDateString
    this.bufferTransactions = this.bufferTransactions.reduce(function (r, a) {
      r[a.transactionDateString] = r[a.transactionDateString] || [];
      r[a.transactionDateString].push(a);
      return r;
    }, Object.create(null));

    for (const [key, value] of Object.entries(this.bufferTransactions)) {
      this.transactionsDateGrp.push(value);
    }

    for (var key in this.transactionsDateGrp) {
      if (!this.transactionsDateGrp.hasOwnProperty(key)) continue;
      var obj = this.transactionsDateGrp[key];
      for (var prop in obj) {
        if (!obj.hasOwnProperty(prop)) continue;
        this.childTransactions.push(obj[prop]);
      }
    }
  }

  // ok
  ngOnDestroy(){
    this.transactions = [];
    this.accountStatement = new AccountStatement();
    this.accountStatement.transactions = this.transactions;
    this.localDataService.setAccountStatement(this.accountStatement);
  }
}
