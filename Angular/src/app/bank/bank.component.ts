import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Bank from '../models/bank';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

  banks: Bank[];

  constructor(public localDataService: LocalDataService, public dataService: DataService, private router: Router) { }

  // ok
  ngOnInit() {
    this.banks = [];
    this.loadBanks();
  }

  // ok
  bankRowSetup(banks){
    banks.forEach((element) => {
      element.bgColor = this.localDataService.getBankColor(element.bankName);      
    });
  }

  // ok
  loadBanks() {
    this.dataService.getBanks()
      .subscribe(
        data => {
          this.banks = data;
          this.bankRowSetup(this.banks);

          // banks sort by bank name
          this.banks.sort((a, b) => a.bankName.localeCompare(b.bankName));
        },
        error => {
          console.log(error);
        });
  }

  // ok
  editBank(editedBank){
    this.router.navigate(['/bank-edit/' + editedBank.bankId]);
  }

  // ok
  removeBank(bank){
    console.log(bank);
  }

  // ok
  addBank(){
    // redirect to bank-add component
    this.router.navigate(['/bank-add']);

  }

  // ok
  getBankAccounts(bank){
    this.router.navigate(['/bank-account-list/' + bank.bankId]);
  }

}
