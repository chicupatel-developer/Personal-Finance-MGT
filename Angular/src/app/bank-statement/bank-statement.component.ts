import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { AccountStatementAllComponent } from '../account-statement-all/account-statement-all.component';
import BankStatement from '../models/bankStatement';


@Component({
  selector: 'app-bank-statement',
  templateUrl: './bank-statement.component.html',
  styleUrls: ['./bank-statement.component.css']
})
export class BankStatementComponent implements OnChanges {
  
  @Input() bankStatement = new BankStatement();

  constructor() { }

  ngOnChanges() {

    this.getAccountFooter();
    this.getBankFooter();
  }

  // account summary
  getAccountFooter(){
    if (this.bankStatement.bankAccounts!=null){
      this.bankStatement.bankAccounts.forEach((element) => {
        // element = account
        var dates = [];
        
        // account wise totalin and totalout
        element.totalIn = 0;
        element.totalOut = 0;
        element.transactions.forEach(tr => {
          dates.push(tr.transactionDate);

          if (tr.transactionTypeDisplay=='In'){
            element.totalIn+=tr.amountPaid;
          }
          else{
            element.totalOut += tr.amountPaid;
          }
        });

        // check for date-range selected or not
        if(this.bankStatement.startDate){
          // date range selected
          var Difference_In_Time = this.bankStatement.endDate.getTime() - this.bankStatement.startDate.getTime();
          element.totalEllapseDays = Difference_In_Time / (1000 * 3600 * 24);

        }
        else{
          // date range not selected
          // get date range from transactions 
          if (dates.length < 1) {
            // no transactions
            element.totalEllapseDays = 0;
          }
          else {
            var minDate = dates.reduce(function (a, b) { return a < b ? a : b; });
            var maxDate = dates.reduce(function (a, b) { return a > b ? a : b; });

            var date1 = new Date(minDate);
            var date2 = new Date(maxDate);

            if (minDate === maxDate) {
              element.totalEllapseDays = 1;
            }
            else {
              // To calculate the time difference of two dates
              var Difference_In_Time = date2.getTime() - date1.getTime();

              // To calculate the no. of days between two dates
              element.totalEllapseDays = Difference_In_Time / (1000 * 3600 * 24);
            }
          }
        }
        
       
      });
    }
    else{
      console.log('Bank-Statement Object Not Aailable !');
    }    
  }

  // bank summary
  getBankFooter(){
    if (this.bankStatement.bankAccounts != null) {
      var dates = [];
      this.bankStatement.totalIn = 0;
      this.bankStatement.totalOut = 0;
      this.bankStatement.bankTotalEllapseDays = 0;

      this.bankStatement.bankAccounts.forEach((element) => {
        // element = account
        this.bankStatement.totalIn+=element.totalIn;
        this.bankStatement.totalOut += element.totalOut;

        element.transactions.forEach(tr => {
          dates.push(tr.transactionDate);
        });
      });

      // check for date-range selected or not
      if (this.bankStatement.startDate) {
        // date range selected
        var Difference_In_Time = this.bankStatement.endDate.getTime() - this.bankStatement.startDate.getTime();
        this.bankStatement.bankTotalEllapseDays = Difference_In_Time / (1000 * 3600 * 24);
      }
      else {
          // date range not selected
          // get date range from transactions 
        if (dates.length < 1) {
          // no transactions
          this.bankStatement.totalIn = 0;
          this.bankStatement.totalOut = 0;
          this.bankStatement.bankTotalEllapseDays = 0;
        }
        else {
          var minDate = dates.reduce(function (a, b) { return a < b ? a : b; });
          var maxDate = dates.reduce(function (a, b) { return a > b ? a : b; });

          var date1 = new Date(minDate);
          var date2 = new Date(maxDate);

          if (minDate === maxDate) {
            this.bankStatement.bankTotalEllapseDays = 1;
          }
          else {
            // To calculate the time difference of two dates
            var Difference_In_Time = date2.getTime() - date1.getTime();

            // To calculate the no. of days between two dates
            this.bankStatement.bankTotalEllapseDays = Difference_In_Time / (1000 * 3600 * 24);
          }
        }
      }
    }
    else {
      console.log('Bank-Statement Object Not Aailable !');
    }
  }
}
