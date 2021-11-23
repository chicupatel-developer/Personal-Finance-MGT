import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

   

  getBank() {
    this.router.navigate(['/bank']);
  }
  getBankAccount() {
    this.router.navigate(['/bank']);
  }
  getTransaction() {
    this.router.navigate(['/bank']);
  }
  getStatement() {
    this.router.navigate(['/bank']);
  }
  getCC() {
    this.router.navigate(['/creditcard']);
  }
  getPayee() {
    this.router.navigate(['/payee']);
  }
  addPayee() {
    this.router.navigate(['/payee-add']);
  }
  accountPayeeReport(){
    this.router.navigate(['/account-payee-report']);
  }
  getAccounts() {
    this.router.navigate(['/account']);
  }
  addAccount() {
    this.router.navigate(['/account-add']);
  }
  addBank() {
    this.router.navigate(['/bank-add']);
  }
  ccPayeeReport() {
    this.router.navigate(['/credit-card-payee-report']);
  }
  getCodingLengthReport(){
    this.router.navigate(['/all-project-coding-length']);
  }
  accountHealthChart(){    
    this.router.navigate(['/monitor-account-monthly']);
  }
}
