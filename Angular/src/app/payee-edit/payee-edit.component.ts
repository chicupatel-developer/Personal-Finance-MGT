import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Payee from '../models/payee';
import PayeeType from '../models/payeeType';
import { HttpErrorResponse } from '@angular/common/http';
import AccountType from '../models/accountType';

@Component({
  selector: 'app-payee-edit',
  templateUrl: './payee-edit.component.html',
  styleUrls: ['./payee-edit.component.css']
})
export class PayeeEditComponent implements OnInit {
  payeeTypesName: string[];
  payeeTypesCollection: PayeeType[];
  
  editingPayee = new Payee();

  payeeForm: FormGroup;
  submitted = false;
  payeeModel = new Payee();

  apiResponse = '';
  responseColor = '';
  errors: string[];

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.errors = [];

    this.payeeTypesName = [];
    this.payeeTypesCollection = [];

    this.loadPayeeTypes();

    this.payeeForm = this.fb.group({
      PayeeName: ['', Validators.required],
      Description: ['', Validators.required],
      PayeeACNumber: ['', Validators.required],
      Balance: ['', Validators.required],
      PayeeType: ['', Validators.required]
    });
  
    try{
      this.editingPayee = JSON.parse(this.route.snapshot.paramMap.get('selectedPayeeObject'));
      this.apiResponse = '';
    }
    catch(Exception){
      this.apiResponse='Invalid Input !';
      this.responseColor = 'red';
      return;
    }   
  
    // do api call to retrieve latest account information 
    this.dataService.getPayee(this.editingPayee.payeeId)
      .subscribe(
        data => {
          this.apiResponse = '';
          this.responseColor = 'green';
          this.errors = [];

          // popup form data with incoming api data call  
          this.payeeForm.setValue({
            PayeeACNumber: data.payeeACNumber,
            Balance: data.balance,
            PayeeType: this.convertPayeeTypeToFormControl(data.payeeType),
            PayeeName: data.payeeName,
            Description: data.description
          });
        },
        error => {
          this.apiResponse = '';
          this.responseColor = 'red';

          this.errors = this.localDataService.display400andEx(error,'Payee');       
        });  
  }

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
  // convert string into int from PayeeType[]
  convertPayeeType(payeeType) {
    var filterByPayeeTypeName = this.payeeTypesCollection.filter(xx => xx.payeeType == payeeType);    
    if (filterByPayeeTypeName != null) {
      return filterByPayeeTypeName[0].indexValue;
    }
    else {
      return -1;
    }
  }
  // convert int to string from payeeType[]
  convertPayeeTypeToFormControl(payeeType) {
    var filterByPayeeType = this.payeeTypesCollection.filter(xx => xx.indexValue == payeeType);    
    if (filterByPayeeType != null) {
      return filterByPayeeType[0].payeeType;
    }
    else {
      return -1;
    }
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.payeeForm.controls[controlName].hasError(errorName);
  }
  get payeeFormControl() {
    return this.payeeForm.controls;
  }

  resetPayee() {
    this.apiResponse = '';
    this.responseColor = '';
    this.errors = [];
    this.payeeForm.reset();
    this.submitted = false;

    this.payeeForm.get("PayeeType").patchValue('');
  }

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
    goBack() {
    this.router.navigate(['/payee']);
  }

  editPayee(): void {
    this.submitted = true;
    if (this.payeeForm.valid) {
      this.payeeModel.payeeACNumber = this.payeeForm.value["PayeeACNumber"];
      this.payeeModel.balance = Number(this.payeeForm.value["Balance"]);
      this.payeeModel.payeeName = this.payeeForm.value["PayeeName"];
      this.payeeModel.description = this.payeeForm.value["Description"];
      this.payeeModel.payeeType = this.convertPayeeType(this.payeeForm.value["PayeeType"]);
      this.payeeModel.payeeId = this.editingPayee.payeeId;


      this.dataService.editPayee(this.payeeModel)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success
              this.apiResponse = response.responseMessage;
              this.responseColor = 'green';
              this.errors = [];
              this.payeeForm.reset();
              this.submitted = false;
              this.payeeForm.get("PayeetType").patchValue('');

              // redirect to payee component
              setTimeout(() => {
                this.router.navigate(['/payee']);
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

            this.errors = this.localDataService.display400andEx(error, 'Payee');          
          }
        );
    }
  }
}
