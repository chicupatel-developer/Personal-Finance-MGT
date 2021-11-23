import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-ac-tran-stat',
  templateUrl: './bank-ac-tran-stat.component.html',
  styleUrls: ['./bank-ac-tran-stat.component.css']
})
export class BankAcTranStatComponent implements OnInit {


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  getBank(){
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
  getAccounts(){
    this.router.navigate(['/account']);
  }
  addAccount() {
    this.router.navigate(['/account-add']);
  }
  addBank() {
    this.router.navigate(['/bank-add']);
  }

}
