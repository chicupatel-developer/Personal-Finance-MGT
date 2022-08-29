import { Injectable } from '@angular/core';
import AccountType from '../models/accountType';
import PayeeType from '../models/payeeType';
import BankTransaction from '../models/bankTransaction';
import Transaction from '../models/transaction';
import AccountStatement from '../models/accountStatement';
import CreditCardTransaction from '../models/creditCardTransaction';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {

  private CCTransaction: CreditCardTransaction;
  private BankTransaction: BankTransaction;
  private Transactions: Transaction[];
  private AccountStatement: AccountStatement;

  constructor() {
    this.CCTransaction = new CreditCardTransaction();
    this.BankTransaction = new BankTransaction();
    this.Transactions = [];
    this.AccountStatement = new AccountStatement();
    this.AccountStatement.transactions = this.Transactions;
  }

  // CCTransaction
  // ok
  setCCTransaction(val) {
    this.CCTransaction = val;
  }
  getCCTransaction() {
    return this.CCTransaction;
  }

  // account-statement-all
  // ok
  // account-statement-transactions
  setAccountStatement(val) {
    this.AccountStatement = val;
  }
  getAccountStatement() {
    return this.AccountStatement;
  }

  // BankTransaction
  // ok
  setBankTransaction(val) {
    this.BankTransaction = val;
  }
  getBankTransaction() {
    return this.BankTransaction;
  }

  // ok
  getCreditCardColor(payeeType) {
    // credit-card
    if (payeeType == 3)
      return 'blue';
    else
      return 'black';
  }

  // ok
  getCCTypeColor(ccName) {
    if (ccName.toLowerCase().search('visa') != -1) {
      return 'orange';
    }
    else if (ccName.toLowerCase().search('master') != -1) {
      return 'lightskyblue';
    }
    else {
      return 'black';
    }
  }

  // ok
  getAccountTypeColor(acType) {
    if (acType == 0)
      return 'green';
    else if (acType == 1)
      return 'blue';
    else
      return 'red';
  }
  // ok
  // returns color name as per bank name
  getBankColor(bankName) {
    if (bankName.search('CIBC') != -1) {
      return 'lightsalmon';
    }
    else if (bankName.search('TD') != -1) {
      return 'lightgreen';
    }
    else if (bankName.search('RBC') != -1) {
      return 'lightsteelblue';
    }
    else if (bankName.search('Scotia') != -1) {
      return 'lightpink';
    }
    else {
      return 'white';
    }
  }

  // ok
  // convert from string[] into PayeeType[]
  getPayeeTypeCollection(payeeTypesCollection: string[]): Array<PayeeType> {
    var payeeTypes = Array<PayeeType>();
    var i = 0;
    payeeTypesCollection.forEach((element) => {
      payeeTypes.push({
        indexValue: i,
        payeeType: element
      });
      i++;
    });
    return payeeTypes;
  }

  // ok
  // 400
  // error handler
  display400andEx(error, componentName): string[] {
    var errors = [];
    if (error.status == 400) {
      // console.log(error.error.error[0]);
      if (error.error.error != null) {
        for (var key in error.error.error) {
          errors.push(error.error.error[key]);
        }
      } else {
        errors.push('[' + componentName + '] Data Not Found ! / Bad Request !');
      }
    }
    else {
      console.log(error);
    }
    return errors;
  }
  displayModelStateErrors(error, componentName): string[] {
    var errors = [];
     if (error.status === 400) {
       if (error.error != null) {
         console.log(error.error);
         if (error.error.status === 400) {
           errors.push(error.error.title+ " !");
         }
         else {
          for (var key in error.error) {
            errors.push(error.error[key]);
          }   
         }        
        } else {
          errors.push('[' + componentName + '] Data Not Found ! / Bad Request !');
        }      
    }
    else {
      console.log(error);
    }
    return errors;
  }

  // ok
  // convert from string[] into AccountType[]
  getAccountTypeCollection(accountTypesCollection: string[]): Array<AccountType> {
    var accountTypes = Array<AccountType>();
    var i = 0;
    accountTypesCollection.forEach((element) => {
      accountTypes.push({
        indexValue: i,
        accountType: element
      });
      i++;
    });
    return accountTypes;
  }

  // ok
  // returns transaction-type(In/Out)
  getTransactionType(tType) {
    if (tType == 0)
      return 'In';
    else
      return 'Out';
  }
}
