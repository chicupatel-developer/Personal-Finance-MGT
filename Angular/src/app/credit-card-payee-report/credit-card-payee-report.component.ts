import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Payee from '../models/payee';
import PayeeType from '../models/payeeType';
import { DatePipe } from '@angular/common';
import CreditCard from '../models/creditCard';

// child component
import {CcStatementComponent } from '../cc-statement/cc-statement.component';
import CreditCardStatement from '../models/creditCardStatement';

@Component({
  selector: 'app-credit-card-payee-report',
  templateUrl: './credit-card-payee-report.component.html',
  styleUrls: ['./credit-card-payee-report.component.css']
})
export class CreditCardPayeeReportComponent implements OnInit {

  creditCards: Array<CreditCard>;

  ccPayeeReportForm: FormGroup;
  submitted = false;

  isDataAvailable: boolean = false;

  payeeTypesName: string[];
  payeeTypesCollection: PayeeType[];

  payees: Payee[];

  // report between 2 dates
  startDate: Date;
  endDate: Date;
  // date comparision
  invalidEndDate = false;
  // date panel visibility
  datePanelDisplay: boolean = false;

  dateRange: boolean = false;

  // reports - (cc)credit-card-payee report
  // to child component
  ccStatement: CreditCardStatement;

  constructor(public datepipe: DatePipe, public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router) { }

  ngOnInit(): void {

    // child component
    // cc-statement
    this.ccStatement = new CreditCardStatement();

    this.payeeTypesName = [];
    this.payeeTypesCollection = [];

    this.payees = [];

    this.ccPayeeReportForm = this.fb.group({
      CreditCardId: ['', Validators.required],
      PayeeId: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required]
    });

    this.loadCC();
    this.loadPayeeTypes();
    this.loadPayee();
  }

  // ok
  loadCC() {
    this.dataService.getCCs()
      .subscribe(
        data => {
          this.creditCards = data;
        },
        error => {
          console.log(error);
        });
  }

  // ok
  loadPayee() {
    this.dataService.getPayees()
      .subscribe(
        data => {
          this.payees = data;

          // payees sort by payee type
          this.payees.sort((a, b) => String(a.payeeType).localeCompare((String)(b.payeeType)));

          // remove CC payee type
          this.payees = this.payees.filter(function (payee) {
            return payee.payeeType != 3;  // 3 = CC
          });
        },
        error => {
          console.log(error);
        });
  }

  // ok
  get ccPayeeReportFormControl() {
    return this.ccPayeeReportForm.controls;
  }

  // ok
  goBack() {
    this.router.navigate(['/home']);
  }

  // ok
  reset() {
    this.ccPayeeReportForm.reset();
    this.submitted = false;
  }

  // ok
  // controls visibility of dates panel
  onItemChange(event) {
    if (event.target.value == 0) {
      this.datePanelDisplay = false;
    }
    else {
      this.datePanelDisplay = true;
      this.ccPayeeReportForm.get("StartDate").enable();
      this.ccPayeeReportForm.get("EndDate").enable();
    }
  }

  // ok
  // credit-card-payee-report
  // filter by payee / date-range
  applyFiltersCCPayeeReport(ccStatement) {
    // filter by payee
    var payeeId = this.ccPayeeReportForm.value["PayeeId"];
    if (payeeId == 0) {
      // all-payee
      // no need filter data
      ccStatement.payeeTypeSummaryDisplay = 'All Payees';
    }
    else {
      ccStatement.transactions = ccStatement.transactions.filter(function (tr) {
        return tr.payeeId == payeeId;
      });
      var payee = this.payees.filter(function (p) {
        return p.payeeId == payeeId;
      });
      ccStatement.payeeTypeSummaryDisplay = this.displayPayeeType(payee[0].payeeType) + '';
    }

    // filter by date-range
    if (this.datePanelDisplay) {
      var startDate = new Date(this.ccPayeeReportForm.value["StartDate"].year + '/' + this.ccPayeeReportForm.value["StartDate"].month + '/' + this.ccPayeeReportForm.value["StartDate"].day);
      var endDate = new Date(this.ccPayeeReportForm.value["EndDate"].year + '/' + this.ccPayeeReportForm.value["EndDate"].month + '/' + this.ccPayeeReportForm.value["EndDate"].day);

      // filter by date-range
      ccStatement.transactions = ccStatement.transactions.filter(function (tr) {
        var date1 = new Date(tr.transactionDate);
        date1.setHours(0, 0, 0, 0);
        // 2021-07-05T00:00:00
        return (date1 >= startDate && date1 <= endDate);
      });

      this.dateRange = true;
      this.ccStatement.startDate = startDate;
      this.ccStatement.endDate = endDate;
    }
    else {
      this.dateRange = false;
      this.ccStatement.startDate = null;
      this.ccStatement.endDate = null;
    }

    // calculate total 
    ccStatement.totalIn = 0;
    ccStatement.totalOut = 0;
    if (ccStatement.transactions.length > 0) {
      ccStatement.transactions.forEach((element) => {
        if(element.transactionTypeDisplay=='In'){
          ccStatement.totalIn+=element.amountPaid;          
        }
        else{
          ccStatement.totalOut += element.amountPaid;
        }
      });
    }
    else {
      ccStatement.totalIn = 0;
      ccStatement.totalOut = 0;
    }
  }

  // ok
  // api call for credit-card-payee-report 
  ccPayeeReport(ccId) {
    var cc = new CreditCard();
    cc.creditCardId = ccId;

    // selected credit card statement for all payees request sent to api
    // after api returns data, client side filter and/or group by applies on payees
    this.dataService.getCreditCardStatementAll(cc)
      .subscribe(
        response => {
          this.ccStatement = response;

          // edit cc color for display
          this.ccStatement.ccColor = this.localDataService.getCCTypeColor(this.ccStatement.creditCardName);

          // edit display text for payee-type / transaction type in transactions[]
          this.ccStatement.transactions.forEach((element) => {
            element.payeeTypeDisplay = (String)(this.displayPayeeType(element.payeeType));            
            element.transactionTypeDisplay = this.localDataService.getTransactionType(element.transactionType);
          });

          this.applyFiltersCCPayeeReport(this.ccStatement);
        },
        error => {
          console.log(error);
        }
      );
  }

  // ok
  // initialize credit-card-payee-report process
  beginCreditCardPayeeReport() {
  
    this.submitted = true;

    // date panel visibility
    // check dates
    if (this.datePanelDisplay) {
      // check everything        
      if (this.ccPayeeReportForm.valid) {
        this.startDate = new Date(this.ccPayeeReportForm.value["StartDate"].year + '/' + this.ccPayeeReportForm.value["StartDate"].month + '/' + this.ccPayeeReportForm.value["StartDate"].day);
        this.endDate = new Date(this.ccPayeeReportForm.value["EndDate"].year + '/' + this.ccPayeeReportForm.value["EndDate"].month + '/' + this.ccPayeeReportForm.value["EndDate"].day);

        // check dates
        if (this.endDate.getTime() > this.startDate.getTime()) {
          this.invalidEndDate = false;
          // calling api            
          console.log('calling api! with dates! cc-payee report!');
          this.ccPayeeReport(Number(this.ccPayeeReportForm.value["CreditCardId"]));
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
      this.ccPayeeReportForm.get("StartDate").disable();
      this.ccPayeeReportForm.get("EndDate").disable();
      if (this.ccPayeeReportForm.valid) {
        // calling api
        console.log('calling api! without dates! cc-payee report!');
        this.ccPayeeReport(Number(this.ccPayeeReportForm.value["CreditCardId"]));
      }
      else {
        // dates are bypassed! [bypassed dates]form submit fails!
      }
    }
  }

  // ok
  public handleError = (controlName: string, errorName: string) => {
    return this.ccPayeeReportForm.controls[controlName].hasError(errorName);
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
  }

 
}
