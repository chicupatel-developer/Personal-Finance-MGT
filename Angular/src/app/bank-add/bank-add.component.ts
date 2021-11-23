import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Bank from '../models/bank';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-bank-add',
  templateUrl: './bank-add.component.html',
  styleUrls: ['./bank-add.component.css']
})
export class BankAddComponent implements OnInit {

  bankForm: FormGroup;
  submitted = false;
  bankModel = new Bank();

  apiResponse = '';
  responseColor = '';
  errors: string[];

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router) { }

  // ok
  ngOnInit(): void {
    this.errors = [];

    this.bankForm = this.fb.group({
      BankName: ['', Validators.required]
    })
  }

  // ok
  get bankFormControl() {
    return this.bankForm.controls;
  }

  // ok
  addBank(): void {
    this.submitted = true;
    if (this.bankForm.valid) {
      this.bankModel.bankName = this.bankForm.value["BankName"];
      this.dataService.addBank(this.bankModel)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success    
              this.apiResponse = response.responseMessage;
              this.responseColor = 'green';
              this.errors = [];

              // this.bankForm.reset();
              this.submitted = false;

              setTimeout(() => {
                this.router.navigate(['/bank']);
                this.apiResponse = '';
                this.bankForm.reset();
              }, 10000);
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

            this.errors = this.localDataService.display400andEx(error, 'Bank');           
          }
        );
    }
  }

  // ok
  resetBank() {
    this.apiResponse = '';
    this.bankForm.reset();
    this.submitted = false;
    this.errors = [];
    this.responseColor = '';
  }

  // ok
  goBack(){
    this.router.navigate(['/bank']);
  }
}
