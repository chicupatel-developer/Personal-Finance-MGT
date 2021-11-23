import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Bank from '../models/bank';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-bank-edit',
  templateUrl: './bank-edit.component.html',
  styleUrls: ['./bank-edit.component.css']
})
export class BankEditComponent implements OnInit {

  bankId: number;
  bgColor = '';
  bankName = '';

  bankForm: FormGroup;
  submitted = false;
  bankModel = new Bank();

  apiResponse = '';
  responseColor = '';
  errors: string[];

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  // ok
  bankRowSetup(bank) {
    this.bgColor = this.localDataService.getBankColor(bank.bankName);
  }

  // ok
  ngOnInit(): void {
    this.errors = [];
    this.bankName = '';

    this.bankForm = this.fb.group({
      BankName: ['', Validators.required]
    });

    this.bankId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(+this.bankId)) {
      this.router.navigate(['/bank']);
    }
    else {
      // do api call to retrieve latest bank information 
      this.dataService.getBank(this.bankId)
        .subscribe(
          data => {
            this.apiResponse = '';
            this.responseColor = 'green';
            this.errors = [];

            // popup form data with incoming api data call  
            this.bankForm.setValue({
              BankName: data.bankName
            });

            this.bankName = data.bankName;

            // get bank wise color
            this.bankRowSetup(data);
          },
          error => {
            this.apiResponse = '';
            this.responseColor = 'red';

            this.errors = this.localDataService.display400andEx(error,'Bank');          
          });
    }
  }

  // ok
  get bankFormControl() {
    return this.bankForm.controls;
  }

  // ok
  resetBank() {
    this.apiResponse = '';
    this.responseColor = '';
    this.bankForm.reset();
    this.submitted = false;
    this.errors = [];
  }

  // ok
  removeBank() {
  }

  // ok
  goBack() {
    this.router.navigate(['/bank']);
  }

  // ok
  editBank(): void {
    this.submitted = true;
    if (this.bankForm.valid) {
      this.bankModel.bankName = this.bankForm.value["BankName"];
      this.bankModel.bankId = this.bankId;

      this.dataService.editBank(this.bankModel)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success
              this.apiResponse = response.responseMessage;
              this.responseColor = 'green';
              this.errors = [];

              // redirect to bank component
              setTimeout(() => {
                this.router.navigate(['/bank']);
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

            this.errors = this.localDataService.display400andEx(error,'Bank');
          
          }
        );
    }
  }

}