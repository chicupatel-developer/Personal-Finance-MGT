import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Payee from '../models/payee';
import PayeeType from '../models/payeeType';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payee',
  templateUrl: './payee.component.html',
  styleUrls: ['./payee.component.css']
})
export class PayeeComponent implements OnInit {
 
  payees: Payee[];
  payeeTypesName: string[];
  payeeTypesCollection: PayeeType[];

  constructor(private http: HttpClient, public localDataService: LocalDataService, public dataService: DataService, private router: Router) { }

  // ok
  ngOnInit() {
    this.payees = [];
    this.payeeTypesName =  [];
    this.payeeTypesCollection = [];
    
    this.loadPayeeTypes();
    this.loadPayees();
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
    if(this.payeeTypesCollection!=null){
      return this.payeeTypesCollection[payeeType].payeeType;
    }
    else{
      return  0;
    }    
  }  

  // ok
  loadPayees() {
    this.dataService.getPayees()
      .subscribe(
        data => {
          this.payees = data;      

          // payees sort by payeeType
          this.payees.sort((a, b) => String(a.payeeType).localeCompare((String)(b.payeeType)));
         
          // edit payees
          this.editPayeeColor_PayeeBalanceColor();       
        },
        error => {
          console.log(error);
        });
  }

  // ok 
  editPayeeColor_PayeeBalanceColor(){
    for (var i = 0; i < this.payees.length; i++) {
      // cc
      if (this.payees[i].payeeType === 3) {
        this.payees[i].payeeColor = 'blue';        
        this.payees[i].payeeIcon = 'bi bi-credit-card';
        
        if (this.payees[i].balance == 0) {
          this.payees[i].balanceColor = 'red';
        }
        else {
          this.payees[i].balanceColor = 'green';
        }
      }
      // phone
      else if (this.payees[i].payeeType === 0){
        this.payees[i].payeeIcon = 'bi bi-phone-fill';
        this.payees[i].payeeColor = 'black';
      }
      // hydro
      else if (this.payees[i].payeeType === 1) {
        this.payees[i].payeeIcon = 'bi bi-lightbulb';
        this.payees[i].payeeColor = 'black';
      }
      // rent
      else if (this.payees[i].payeeType === 2) {
        this.payees[i].payeeIcon = 'bi bi-house';
        this.payees[i].payeeColor = 'black';
      }
      // walmart
      else if (this.payees[i].payeeType === 4) {
        this.payees[i].payeeIcon = 'bi bi-asterisk';
        this.payees[i].payeeColor = 'black';
      }
      // super store
      else if (this.payees[i].payeeType === 5) {
        this.payees[i].payeeIcon = 'bi bi-cart4';
        this.payees[i].payeeColor = 'black';
      }
      // bombay spices
      else if (this.payees[i].payeeType === 6) {
        this.payees[i].payeeIcon = 'bi bi-cart3';
        this.payees[i].payeeColor = 'black';
      }
      // canadian tire
      else if (this.payees[i].payeeType === 7) {
        this.payees[i].payeeIcon = 'bi bi-gear';
        this.payees[i].payeeColor = 'black';
      }
      // car service
      else if (this.payees[i].payeeType === 8) {
        this.payees[i].payeeIcon = 'bi bi-speedometer2';
        this.payees[i].payeeColor = 'black';
      }
      // tim hortons
      else if (this.payees[i].payeeType === 9) {
        this.payees[i].payeeIcon = 'bi bi-cup-straw';
        this.payees[i].payeeColor = 'black';
      }
      // medicine walmart
      else if (this.payees[i].payeeType === 10) {
        this.payees[i].payeeIcon = 'bi bi-hourglass-top';
        this.payees[i].payeeColor = 'black';
      }
      // medicine super store
      else if (this.payees[i].payeeType === 11) {
        this.payees[i].payeeIcon = 'bi bi-hourglass-bottom';
        this.payees[i].payeeColor = 'black';
      }
      // others
      else {
        this.payees[i].payeeColor = 'black';
        this.payees[i].payeeIcon = 'bi bi-brightness-high-fill';
      }
    }
  }

  // ok
  editPayee(editPayee) {
    // redirect to payee-edit component
    // this.router.navigate(['/payee-edit/' + editPayee.payeeId]);
    this.router.navigate(['/payee-edit/', { selectedPayeeObject: JSON.stringify(editPayee) }]);
  }

  // ok
  removePayee(payee){
    console.log(payee);
  }

  // ok
  addPayee(){
    // redirect to payee-add component
    this.router.navigate(['/payee-add']);
  }

 
}
