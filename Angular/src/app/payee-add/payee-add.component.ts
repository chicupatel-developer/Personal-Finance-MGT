import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import Payee from '../models/payee';
import PayeeType from '../models/payeeType';

@Component({
  selector: 'app-payee-add',
  templateUrl: './payee-add.component.html',
  styleUrls: ['./payee-add.component.css']
})
export class PayeeAddComponent implements OnInit {
  
  displayBalance = false;

  payeeTypesName: string[];
  payeeTypesCollection: PayeeType[];

  payeeForm: FormGroup;
  submitted = false;
  payeeModel: Payee;

  apiResponse = '';
  responseColor = '';
  errors: string[];

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router) { }

  // ok
  ngOnInit(): void {
    this.errors = [];
    this.payeeModel = new Payee();
    this.payeeTypesName = [];
    this.payeeTypesCollection = [];

    this.loadPayeeTypes();

    this.payeeForm = this.fb.group({
      PayeeName: ['', Validators.required],
      Description: ['', Validators.required],
      PayeeACNumber: ['', Validators.required],
      PayeeType: ['', Validators.required],
      Balance: ['', Validators.required]
    });
  }
  // ok
  changePayee(e) {
    if(e.target.value=='CreditCard')
      this.displayBalance = true;
    else
      this.displayBalance = false;
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
  convertPayeeType(payeeType) {
    console.log(payeeType);
    var filterByPayeeTypeName = this.payeeTypesCollection.filter(xx => xx.payeeType == payeeType);
    console.log(filterByPayeeTypeName);
    if (filterByPayeeTypeName != null) {
      return filterByPayeeTypeName[0].indexValue;
    }
    else {
      return -1;
    }
  }

  // ok
  public handleError = (controlName: string, errorName: string) => {
    return this.payeeForm.controls[controlName].hasError(errorName);
  }

  // ok
  get payeeFormControl() {
    return this.payeeForm.controls;
  }

  // ok
  resetPayee() {
    this.apiResponse = '';
    this.payeeForm.reset();
    this.submitted = false;
    this.errors = [];
    this.responseColor = '';

    this.payeeForm.get("PayeeType").patchValue('');
  }

  // ok
  addPayee() {
    this.submitted = true;

    if (this.payeeForm.value["PayeeType"]!='CreditCard'){
      this.payeeForm.get("Balance").patchValue(0);
    }

    if (this.payeeForm.valid) {
      this.payeeModel.payeeName = this.payeeForm.value["PayeeName"];
      this.payeeModel.description = this.payeeForm.value["Description"];
      this.payeeModel.payeeACNumber = this.payeeForm.value["PayeeACNumber"];
      this.payeeModel.payeeType = this.convertPayeeType(this.payeeForm.value["PayeeType"]);
      this.payeeModel.balance = Number(this.payeeForm.value["Balance"]);

      console.log(this.payeeModel);
      
      this.dataService.addPayee(this.payeeModel)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success    
              this.apiResponse = response.responseMessage;
              this.responseColor = 'green';

              this.payeeForm.reset();
              this.errors = [];
              this.submitted = false;

              // selectlist set to default
              this.payeeForm.get("PayeeType").patchValue('');

              setTimeout(() => {
                this.router.navigate(['/payee']);
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

            this.errors = this.localDataService.display400andEx(error,'Payee');           
          }
        );        
    }
  }

  // ok
  goBack() {
    this.router.navigate(['/payee']);
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
}
