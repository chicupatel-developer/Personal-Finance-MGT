import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Account from '../models/account';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Bank from '../models/bank';
import { HttpErrorResponse } from '@angular/common/http';
import AccountType from '../models/accountType';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {
 
  accountTypesName: string[];
  accountTypesCollection: AccountType[];
  
  editingAccount = new Account();

  banks: Array<Bank>;
  accountForm: FormGroup;
  submitted = false;
  accountModel = new Account();

  apiResponse = '';
  responseColor = '';
  errors: string[];

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  // ok
  ngOnInit(): void {
    this.errors = [];

    this.accountTypesName = [];
    this.accountTypesCollection = [];

    this.loadAccountTypes();

    this.accountForm = this.fb.group({
      BankId: ['', Validators.required],
      AccountNumber: ['', Validators.required],
      Balance: ['', Validators.required],
      AccountType: ['', Validators.required]
    });

    this.loadBanks();
  
    try{
      this.editingAccount = JSON.parse(this.route.snapshot.paramMap.get('selectedAccountObject'));
      this.apiResponse = '';
    }
    catch(Exception){
      this.apiResponse='Invalid Input !';
      this.responseColor = 'red';
      return;
    }   
  
    // do api call to retrieve latest account information 
    this.dataService.getAccount(this.editingAccount.accountId)
      .subscribe(
        data => {
          this.apiResponse = '';
          this.responseColor = 'green';
          this.errors = [];

          // popup form data with incoming api data call  
          this.accountForm.setValue({
            AccountNumber: data.accountNumber,
            Balance: data.balance,
            AccountType: this.convertAccountTypeToFormControl(data.accountType),
            BankId: data.bankId
          });
        },
        error => {
          this.apiResponse = '';
          this.responseColor = 'red';

          this.errors = this.localDataService.display400andEx(error,'Account');       
        });  
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
  // convert string into int from AccountType[]
  convertAccountType(accountType) {
    var filterByAccountTypeName = this.accountTypesCollection.filter(xx => xx.accountType == accountType);    
    if (filterByAccountTypeName != null) {
      return filterByAccountTypeName[0].indexValue;
    }
    else {
      return -1;
    }
  }
  // ok
  // convert int to string from AccountType[]
  convertAccountTypeToFormControl(acType) {
    var filterByAccountType = this.accountTypesCollection.filter(xx => xx.indexValue == acType);    
    if (filterByAccountType != null) {
      return filterByAccountType[0].accountType;
    }
    else {
      return -1;
    }
  }

  // ok
  public handleError = (controlName: string, errorName: string) => {
    return this.accountForm.controls[controlName].hasError(errorName);
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
  get accountFormControl() {
    return this.accountForm.controls;
  }

  // ok
  resetAccount() {
    this.apiResponse = '';
    this.responseColor = '';
    this.errors = [];
    this.accountForm.reset();
    this.submitted = false;

    this.accountForm.get("AccountType").patchValue('');
    this.accountForm.get("BankId").patchValue('');
  }

  // ok
  numberOnly(event, param): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    // 0 = numbers and decimals
    if (param == 0) {
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
    else {
      // numbers only
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
  }

  // ok
  removeAccount() {
  }

  // ok
  goBack() {
    this.router.navigate(['/account']);
  }

  // ok
  editAccount(): void {
    this.submitted = true;
    if (this.accountForm.valid) {
      this.accountModel.accountNumber = Number(this.accountForm.value["AccountNumber"]);
      this.accountModel.balance = Number(this.accountForm.value["Balance"]);
      this.accountModel.bankId = Number(this.accountForm.value["BankId"]);
      this.accountModel.accountType = this.convertAccountType(this.accountForm.value["AccountType"]);
      this.accountModel.accountId = this.editingAccount.accountId;


      this.dataService.editAccount(this.accountModel)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success
              this.apiResponse = response.responseMessage;
              this.responseColor = 'green';
              this.errors = [];
              this.accountForm.reset();
              this.submitted = false;
              this.accountForm.get("AccountType").patchValue('');
              this.accountForm.get("BankId").patchValue('');

              // redirect to account component
              setTimeout(() => {
                this.router.navigate(['/account']);
              }, 3000);
            }
            else {
              // fail
              // display error message
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

}
