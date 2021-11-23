import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Payee from '../models/payee';
import PayeeType from '../models/payeeType';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CreditCardTransaction from '../models/creditCardTransaction';

@Component({
  selector: 'app-creditcard',
  templateUrl: './creditcard.component.html',
  styleUrls: ['./creditcard.component.css']
})
export class CreditcardComponent implements OnInit {

  isDataAvailable: boolean = false;

  ccTransaction: CreditCardTransaction;

  closeModal: string;
  
  payees: Payee[];
  payeeTypesName: string[];
  payeeTypesCollection: PayeeType[];

  constructor(private modalService: NgbModal, private http: HttpClient, public localDataService: LocalDataService, public dataService: DataService, private router: Router) { }

  // ok
  ngOnInit() {
    this.payees = [];
    this.payeeTypesName = [];
    this.payeeTypesCollection = [];

    this.loadPayeeTypes();
    this.loadPayees();

    this.ccTransaction = new CreditCardTransaction();
  }

  // ok
  loadPayeeTypes() {
    this.dataService.getPayeeTypes()
      .subscribe(
        data => {
          this.payeeTypesName = data;
          this.payeeTypesCollection = this.localDataService.getPayeeTypeCollection(this.payeeTypesName);

          this.isDataAvailable = true;
        },
        error => {
          console.log(error);
        });
  }

  // ok
  displayPayeeType(payeeType) {
    if (this.payeeTypesCollection != null) {
      return this.payeeTypesCollection[payeeType].payeeType;
    }
    else {
      return 0;
    }
  }
  
  // toDo
  // Cannot read property 'indexValue' of undefined
  // at creditcard.component.ts: 85
  // ok  
  loadPayees() {
    // all types of payees are returning from api
    // this.dataService.getPayees()
    this.dataService.getPayeesCC()
      .subscribe(
        data => {

          // only CC type of payees are returning from api
          // no need for filter @ client side
          this.payees = data;

          // filter @ client side, if all types of payees are returning from api
          // filter out only CreditCard type of Payees
          // returns 3 for CreditCard
          // console.log(this.payeeTypesCollection.filter(xx=>xx.payeeType=='CreditCard')[0].indexValue);
          // this.payees = this.payees.filter(aa => aa.payeeType == this.payeeTypesCollection.filter(xx => xx.payeeType == 'CreditCard')[0].indexValue);

          // edit display color for payees
          this.editPayeeColor_PayeeBalanceColor();
        },
        error => {
          console.log(error);
        });
  }

  // ok
  // edit display color for payees
  editPayeeColor_PayeeBalanceColor() {
    for (var i = 0; i < this.payees.length; i++) {
      // payeeColor
      if (this.payees[i].payeeName.toLowerCase().search('visa') != -1) {
        this.payees[i].payeeColor = 'orange';   
      }
      else if (this.payees[i].payeeName.toLowerCase().search('master') != -1) {
        this.payees[i].payeeColor = 'lightskyblue';
      }
      else {
        this.payees[i].payeeColor = 'black';
      }

      // balanceColor
      if (this.payees[i].balance == 0) {
        this.payees[i].balanceColor = 'red';
      }
      else {
        this.payees[i].balanceColor = 'green';
      }
    }
  }  

  // ok
  ccTransactionBegin(creditcard, content) {
    // console.log(creditcard);
    if(creditcard.balance==0){
      // display modal 
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
        this.closeModal = `Closed with: ${res}`;
      }, (res) => {
        this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
      });
    }
    else{
      this.ccTransaction.creditCardId = creditcard.payeeId;
      this.ccTransaction.balance = creditcard.balance;
      this.ccTransaction.ccAccountNumber = creditcard.payeeACNumber;
      this.ccTransaction.ccColor = this.localDataService.getCCTypeColor(creditcard.payeeName);

      // store this ccTransaction to local-data-service
      this.localDataService.setCCTransaction(this.ccTransaction);

      // redirect to credit-card-transaction component
      this.router.navigate(['/credit-card-transaction']);
    }
   
  }

  // ok
  goBack() {
    this.router.navigate(['/home']);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
