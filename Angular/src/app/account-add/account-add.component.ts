import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Bank from '../models/bank';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import Account from '../models/account';
import AccountType from '../models/accountType';

@Component({
  selector: 'app-account-add',
  templateUrl: './account-add.component.html',
  styleUrls: ['./account-add.component.css']
})
export class AccountAddComponent implements OnInit {

  accountTypesName: string[];
  accountTypesCollection: AccountType[];

  accountForm: FormGroup;
  submitted = false;
  accountModel:  Account;
  banks: Bank[];

  apiResponse = '';
  responseColor = '';
  errors: string[];
  
  // accountTypeCollection: any = ['Chequing', 'Savings', 'TFSA'];

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router) { }

  // ok
  numberOnly(event, param): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
  
    // 0 = numbers and decimals
    if(param==0){
      // numbers and decimals
      if (event.key == '.') {
        return true;
      }
      else {
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
      }
    }
    else{
      // numbers only
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
  }

  // ok
  public handleError = (controlName: string, errorName: string) => {
    return this.accountForm.controls[controlName].hasError(errorName);
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
  convertAccountType(accountType) {
    console.log(accountType);
    var filterByAccountTypeName = this.accountTypesCollection.filter(xx => xx.accountType == accountType);
    console.log(filterByAccountTypeName);
    if (filterByAccountTypeName != null) {
      return filterByAccountTypeName[0].indexValue;
    }
    else {
      return -1;
    }
  }

  // ok
  get accountFormControl() {
    return this.accountForm.controls;
  }

  // ok
  resetAccount(){
    this.apiResponse = '';
    this.accountForm.reset();
    this.submitted = false;
    this.errors = [];
    this.responseColor = '';

    this.accountForm.get("AccountType").patchValue('');
    this.accountForm.get("BankId").patchValue('');
  }

  // ok
  addAccount(){
    this.submitted = true;
    if (this.accountForm.valid) {      
      this.accountModel.accountNumber = Number(this.accountForm.value["AccountNumber"]);
      this.accountModel.balance = Number(this.accountForm.value["Balance"]); 
      this.accountModel.bankId = Number(this.accountForm.value["BankId"]);
      this.accountModel.accountType = this.convertAccountType(this.accountForm.value["AccountType"]);

      this.dataService.addAccount(this.accountModel)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success    
              this.apiResponse = response.responseMessage;
              this.responseColor = 'green';
              
              this.accountForm.reset();
              this.errors = [];
              this.submitted = false;

              // selectlist set to default
              this.accountForm.get("AccountType").patchValue('');
              this.accountForm.get("BankId").patchValue('');             

              setTimeout(() => {
                this.router.navigate(['/account']);
                this.apiResponse = '';
              }, 3000);
            }
            else {
              // server error
              this.apiResponse = response.responseCode + ' : ' + response.responseMessage;
              this.responseColor = 'red';

              this.errors = [];
            }
          },
          error => {
            this.apiResponse = '';
            this.responseColor = 'red';
            this.errors = [];

            this.errors = this.localDataService.display400andEx(error, 'Account');          
          }
        );
    }

  }

  // ok
  ngOnInit(): void {
    this.errors = [];
    this.banks = [];
    this.accountModel = new Account();
    this.accountTypesName = [];
    this.accountTypesCollection = [];

    this.loadAccountTypes();

    this.loadBanks();

    this.accountForm = this.fb.group({
      BankId: ['', Validators.required],
      AccountNumber: ['', Validators.required],
      Balance: ['', Validators.required],
      AccountType: ['', Validators.required]
    });
  }

  // ok
  // load bank list
  loadBanks() {    
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
  goBack() {
    this.router.navigate(['/account']);
  }  
}
