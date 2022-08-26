import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Bank from '../models/bank';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Account from '../models/account';
import AccountType from '../models/accountType';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  accounts: Account[];
  accountTypesName: string[];
  accountTypesCollection: AccountType[];

  constructor(public localDataService: LocalDataService, public dataService: DataService, private router: Router) { }

  // ok
  ngOnInit() {
    this.accounts = [];
    this.accountTypesName = [];
    this.accountTypesCollection = [];

    this.loadAccountTypes();
    this.loadAccounts();
  }

  // ok
  loadAccountTypes() {
    this.dataService.getAccountTypes()
      .subscribe(
        data => {
          this.accountTypesName = data;
          this.accountTypesCollection = this.localDataService.getAccountTypeCollection(this.accountTypesName);
        },
        error => {
          console.log(error);
        });
  }
  // ok
  displayAccountType(accountType) {
    if (this.accountTypesCollection != null) {
      return this.accountTypesCollection[accountType].accountType;
    }
    else {
      return 0;
    }
  }

  // ok
  bankRowSetup(accounts) {
    accounts.forEach((element) => {
      element.bgColor = this.localDataService.getBankColor(element.bankName);
    });
  }

  // ok
  loadAccounts() {
    this.dataService.getAccounts()
      .subscribe(
        data => {
          console.log(data);
          this.accounts = data;
          
          // bank name wise color setup
          this.bankRowSetup(this.accounts);

          // accounts sort by bank name
          this.accounts.sort((a, b) => a.bankName.localeCompare(b.bankName));          
        },
        error => {
          console.log(error);
        });
  }

  // ok
  editAccount(editAccount) {
    // redirect to account-edit component
    // this.router.navigate(['/account-edit/' + editAccount.accountId]);
    this.router.navigate(['/account-edit/', { selectedAccountObject: JSON.stringify(editAccount) }]);
  }

  // ok
  removeAccount(account) {
    console.log(account);
  }

  // ok
  addAccount() {
    // redirect to account-add component
    this.router.navigate(['/account-add']);

  }
}
