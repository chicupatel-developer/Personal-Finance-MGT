import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { DataService } from '../services/data.service';
import Bank from '../models/bank';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Account from '../models/account';
import AccountVM from '../models/accountVM';
import AccountType from '../models/accountType';
import Payee from '../models/payee';
import PayeeType from '../models/payeeType';
import { DatePipe } from '@angular/common';
import AccountStatement from '../models/accountStatement';
import Transaction from '../models/transaction';
import BankStatement from '../models/bankStatement';
import BankStat from '../models/bankStat';

// child component
import { AccountTransactionComponent } from '../account-transaction/account-transaction.component';
import { BankStatementComponent } from '../bank-statement/bank-statement.component';

@Component({
  selector: 'app-account-payee-report',
  templateUrl: './account-payee-report.component.html',
  styleUrls: ['./account-payee-report.component.css']
})
export class AccountPayeeReportComponent implements OnInit {

  banks: Array<Bank>;
  accounts: Array<AccountVM>;
  accountPayeeReportForm: FormGroup;
  submitted = false;

  isDataAvailable: boolean = false;
  accountTypesName: string[];
  accountTypesCollection: AccountType[];
  payeeTypesName: string[];
  payeeTypesCollection: PayeeType[];

  payees: Payee[];

  // report between 2 dates
  startDate: Date;
  endDate: Date;
  // date comparision
  invalidEndDate = false;
  // date panel visibility
  datePanelDisplay : boolean = false;

  // reports
  accountStatement: AccountStatement;
  transactions: Transaction[];

  // to child component
  childTransactions: Transaction[];

  // payee summary
  dateRange : boolean = false;

  // all accounts of selected bank
  // disable account select list flag
  allAccounts : boolean = false;
    
  bankStat = new BankStat();
  // reports - (bank)all-accounts-payee report
  // to child component
  bankStatement : BankStatement;

  constructor(public datepipe: DatePipe,public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router) { }

  // ok
  ngOnInit() {

    // child component
    // bank-statement
    this.bankStatement = new BankStatement();
    
    // to child component
    this.childTransactions = [];
    
    this.accountStatement = new AccountStatement();
    this.transactions = [];
    this.accountStatement.transactions = this.transactions;

    this.accountTypesName = [];
    this.accountTypesCollection = [];

    this.payeeTypesName = [];
    this.payeeTypesCollection = [];

    this.payees = [];

    this.accountPayeeReportForm = this.fb.group({
      BankId: ['', Validators.required],
      AccountId: ['', Validators.required],
      PayeeId: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required]
    });

    this.loadPayeeTypes();
    this.loadAccountTypes();
    this.loadBank();
    this.loadPayee();
  }
 
  // ok
  loadPayee(){
    this.dataService.getPayees()
      .subscribe(
        data => {
          this.payees = data;

          // payees sort by payeeType
          this.payees.sort((a, b) => String(a.payeeType).localeCompare((String)(b.payeeType)));
        },
        error => {
          console.log(error);
        });
  }
 
  // ok
  loadBank() {
    this.dataService.getBanks()
      .subscribe(
        data => {
          this.banks = data;
        },
        error => {
          console.log(error);
        });
  }
  // ok
  changeAccount(e) {
    if (e.target.value == "All Accounts") {
      this.allAccounts = true;
    }
    else{
      this.allAccounts = false;
    }
  }
  // ok
  changeBank(e) {
    if (e.target.value == "") {
      this.resetSelectList();
      return;
    }
    else {
      this.resetSelectList();
      this.loadAccounts(e.target.value);
    }
  }
  // ok
  // reset account select list
  resetSelectList() {
    this.accounts = [];
    this.accountPayeeReportForm.get("AccountId").patchValue("");
  }

  // ok
  loadAccounts(selectedBankId) {
    this.dataService.getBankAccounts(selectedBankId)
      .subscribe(
        data => {
          if (data.accounts.length <= 0) {
            this.accountPayeeReportForm.controls['AccountId'].setValue('');
          }
          this.accounts = data.accounts;
        },
        error => {
          console.log(error);
        });
  }

  // ok
  get accountPayeeReportFormControl() {
    return this.accountPayeeReportForm.controls;
  }

  // ok
  goBack(){
    this.router.navigate(['/home']);
  }

  // ok
  reset(){
    this.accountPayeeReportForm.reset();
    this.submitted = false;

    this.transactions = [];
    this.accountStatement = new AccountStatement();
    this.accountStatement.transactions = this.transactions;
    this.childTransactions = [];
  }
 
  // ok
  // controls visibility of dates panel
  onItemChange(event){
    if(event.target.value==0){
      this.datePanelDisplay = false;
    }
    else{
      this.datePanelDisplay = true;
      this.accountPayeeReportForm.get("StartDate").enable();
      this.accountPayeeReportForm.get("EndDate").enable();
    }
  }

  // ok
  // account-payee-report
  // filter by payee / date-range
  applyFiltersAccountPayeeReport(accountStatement){
    this.childTransactions = [];
    // to child component
    this.accountStatement.transactions.forEach((element) => {
      this.childTransactions.push(element);
    });

    // filter by payee-type
    var payeeId = this.accountPayeeReportForm.value["PayeeId"];
    if(payeeId==0){
      // all-payee-type
      // no need filter data
      accountStatement.payeeTypeSummaryDisplay = 'All Payees';
    }
    else{
      // filter by payee-type
      this.childTransactions = this.childTransactions.filter(function (tr) {
        return tr.payeeId == payeeId;
      });
      var payee = this.payees.filter(function(p) {
        return p.payeeId == payeeId;
      });
      accountStatement.payeeTypeSummaryDisplay = this.displayPayeeType(payee[0].payeeType) + '';
    }

    // filter by date-range
    if(this.datePanelDisplay){
      var startDate = new Date(this.accountPayeeReportForm.value["StartDate"].year + '/' + this.accountPayeeReportForm.value["StartDate"].month + '/' + this.accountPayeeReportForm.value["StartDate"].day);
      var endDate = new Date(this.accountPayeeReportForm.value["EndDate"].year + '/' + this.accountPayeeReportForm.value["EndDate"].month + '/' + this.accountPayeeReportForm.value["EndDate"].day);

      // filter by date-range
      this.childTransactions = this.childTransactions.filter(function (tr) {
        var date1 = new Date(tr.transactionDate);
        date1.setHours(0, 0, 0, 0);
        // 2021-07-05T00:00:00
        return (date1 >= startDate && date1 <= endDate);
      });

      this.dateRange = true;
      this.accountStatement.startDate = startDate;
      this.accountStatement.endDate = endDate;
    }
    else{
      this.dateRange = false;
      this.accountStatement.startDate = null;
      this.accountStatement.endDate = null;
    }

    // calculate total 
    accountStatement.totalIn = 0;
    accountStatement.totalOut = 0;
    if (this.childTransactions.length > 0) {
      this.childTransactions.forEach((element) => {
        if (element.transactionTypeDisplay == 'In') {
          accountStatement.totalIn += element.amountPaid;
        }
        else {
          accountStatement.totalOut += element.amountPaid;
        }
      });
    }
    else {
      accountStatement.totalIn = 0;
      accountStatement.totalOut = 0;
    }
  }

  // ok
  // api call for account-payee-report 
  // filter by payee / date-range
  accountPayeeReport(accountId){
    var accountVM = new AccountVM();
    accountVM.accountId = accountId;

    this.dataService.getAccountStatementAll(accountVM)
      .subscribe(
        response => {
          if (response.accountId) {
            // success       
            this.accountStatement = response;
            this.accountStatement.accountTypeDisplay = (String)(this.displayAccountType(this.accountStatement.accountType));
            this.accountStatement.transactions.forEach((element) => {
              element.payeeTypeDisplay = (String)(this.displayPayeeType(element.payeeType));
              element.transactionTypeDisplay = this.localDataService.getTransactionType(element.transactionType); 
            });

            // store original account-statement to local-data-service
            this.localDataService.setAccountStatement(this.accountStatement);

            this.applyFiltersAccountPayeeReport(this.accountStatement);
          }
          else if (response.responseCode == -1) {
            // server error
            // server exception
          }
        },
        error => {

        }
      );
  }

  // ok
  // all accounts-payee-report
  // bank-statement-report
  // filter by payee / date-range
  applyFiltersBankStatement() {
    // filter by payee
    var payeeId = this.accountPayeeReportForm.value["PayeeId"];
    if (payeeId == 0) {
      // all-payee
      // no need filter data
      this.bankStatement.payeeTypeSummaryDisplay = 'All Payees';
    }
    else {     
      this.bankStatement.bankAccounts.forEach((account) => {
        account.transactions = account.transactions.filter(function (tr) {
          return tr.payeeId == payeeId;
        });   
      });
      var payee = this.payees.filter(function (p) {
        return p.payeeId == payeeId;
      });
      this.bankStatement.payeeTypeSummaryDisplay = this.displayPayeeType(payee[0].payeeType) + '';
    }  

    // filter by date-range
    if (this.datePanelDisplay) {
      var startDate = new Date(this.accountPayeeReportForm.value["StartDate"].year + '/' + this.accountPayeeReportForm.value["StartDate"].month + '/' + this.accountPayeeReportForm.value["StartDate"].day);
      var endDate = new Date(this.accountPayeeReportForm.value["EndDate"].year + '/' + this.accountPayeeReportForm.value["EndDate"].month + '/' + this.accountPayeeReportForm.value["EndDate"].day);

      this.bankStatement.bankAccounts.forEach((account) => {
        account.transactions = account.transactions.filter(function (tr) {
          var date1 = new Date(tr.transactionDate);
          date1.setHours(0, 0, 0, 0);
          // 2021-07-05T00:00:00
          return (date1 >= startDate && date1 <= endDate);
        });
      });
      this.dateRange = true;
      this.bankStatement.startDate = startDate;
      this.bankStatement.endDate = endDate;
    }
    else {
      this.dateRange = false;
      this.bankStatement.startDate = null;
      this.bankStatement.endDate = null;
    }
  }

  // ok
  // all accounts-payee-report
  // bank-statement-report
  // bank-statement
  getBankStatement(bank){
    this.allAccounts = true;    
    this.accountPayeeReportForm.get("AccountId").enable();

    this.dataService.getBankStatement(bank)
      .subscribe(
        response => {
          if (response.bankId) {
            // success       
            this.bankStatement = response;

            // edit bankColor for bank
            this.bankStatement.bankColor = this.localDataService.getBankColor(this.bankStatement.bankName);
            // edit display text/display color for account-type
            this.bankStatement.bankAccounts.forEach((element) => {
              element.accountTypeDisplay = (String)(this.displayAccountType(element.accountType));
              element.accountColor = (String)(this.localDataService.getAccountTypeColor(element.accountType));

              // edit display text for payee-type in transactions[]            
              element.transactions.forEach(tr => {
                tr.payeeTypeDisplay = (String)(this.displayPayeeType(tr.payeeType));
                tr.transactionTypeDisplay = this.localDataService.getTransactionType(tr.transactionType);                
              });

              // apply filters
              this.applyFiltersBankStatement();
            });
          }
          else if (response.responseCode == -1) {
            // server error
            // server exception
            console.log(response.responseMessage);
          }
        },
        error => {
          console.log(error);
        }
      );
  }
  
  // ok
  // initialize account-payee-report process
  beginAccountPayeeReport(){
    this.transactions = [];
    this.accountStatement = new AccountStatement();
    this.accountStatement.transactions = this.transactions;
    this.childTransactions = [];

    this.submitted = true;

    // all accounts option selected, controls visibility of account select list
    // all-accounts-payee report
    // bank-statement
    if(this.allAccounts){
      this.accountPayeeReportForm.get("AccountId").disable();
      // date panel visibility
      // check dates
      if (this.datePanelDisplay) {
        // check everything        
        if (this.accountPayeeReportForm.valid) {
          this.startDate = new Date(this.accountPayeeReportForm.value["StartDate"].year + '/' + this.accountPayeeReportForm.value["StartDate"].month + '/' + this.accountPayeeReportForm.value["StartDate"].day);
          this.endDate = new Date(this.accountPayeeReportForm.value["EndDate"].year + '/' + this.accountPayeeReportForm.value["EndDate"].month + '/' + this.accountPayeeReportForm.value["EndDate"].day);

          // check dates
          if (this.endDate.getTime() > this.startDate.getTime()) {
            this.invalidEndDate = false;
            // calling api            
            console.log('calling api! with dates! all-accounts-payee report!');            
            this.getBankStatement(this.getInputsForBankStatement());
          }
          else {
            // only dates not ok!
            this.submitted = false;
            this.invalidEndDate = true;
            return;
          }
        }
        else {
          // total form submit fails!
          this.invalidEndDate = false;
        }
      }
      // bypass dates while check everything
      else {
        // bypass dates while check everything
        this.accountPayeeReportForm.get("StartDate").disable();
        this.accountPayeeReportForm.get("EndDate").disable();
        if (this.accountPayeeReportForm.valid) {
          // calling api
          console.log('calling api! without dates! all-accounts-payee report!');                   
          this.getBankStatement(this.getInputsForBankStatement());
        }
        else {
          // dates are bypassed! [bypassed dates]form submit fails!
        }
      }
    }
    // account-payee report
    else{
      this.accountPayeeReportForm.get("AccountId").enable();

      // date panel visibility
      // check dates
      if (this.datePanelDisplay) {
        // check everything        
        if (this.accountPayeeReportForm.valid) {
          this.startDate = new Date(this.accountPayeeReportForm.value["StartDate"].year + '/' + this.accountPayeeReportForm.value["StartDate"].month + '/' + this.accountPayeeReportForm.value["StartDate"].day);
          this.endDate = new Date(this.accountPayeeReportForm.value["EndDate"].year + '/' + this.accountPayeeReportForm.value["EndDate"].month + '/' + this.accountPayeeReportForm.value["EndDate"].day);

          // check dates
          if (this.endDate.getTime() > this.startDate.getTime()) {
            this.invalidEndDate = false;
            // calling api            
            console.log('calling api! with dates! account-payee report!');
            this.accountPayeeReport(Number(this.accountPayeeReportForm.value["AccountId"]));            
          }
          else {
            // only dates not ok!
            this.submitted = false;
            this.invalidEndDate = true;
            return;
          }
        }
        else {
          // total form submit fails!
          this.invalidEndDate = false;
        }
      }
      // bypass dates while check everything
      else {
        // bypass dates while check everything
        this.accountPayeeReportForm.get("StartDate").disable();
        this.accountPayeeReportForm.get("EndDate").disable();
        if (this.accountPayeeReportForm.valid) {
          // calling api
          console.log('calling api! without dates! account-payee report!');
          this.accountPayeeReport(Number(this.accountPayeeReportForm.value["AccountId"]));
        }
        else {
          // dates are bypassed! [bypassed dates]form submit fails!
        }
      }
    }
  }

  // ok
  public handleError = (controlName: string, errorName: string) => {
    return this.accountPayeeReportForm.controls[controlName].hasError(errorName);
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
  ngOnDestroy() {
    this.transactions = [];
    this.accountStatement = new AccountStatement();
    this.accountStatement.transactions = this.transactions;
    this.childTransactions = [];
  }

  // ok
  private getInputsForBankStatement() {
    this.bankStat = new BankStat();
    var bankId_ = this.accountPayeeReportForm.value["BankId"];
    var bank = this.banks.filter(function (b) {
      return b.bankId == bankId_;
    });
    this.bankStat.bankId = Number(bankId_);
    this.bankStat.bankName = bank[0].bankName;
    return this.bankStat;
  }
}
