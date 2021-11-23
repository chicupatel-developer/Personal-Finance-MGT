import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { AccountStatementAllComponent } from '../account-statement-all/account-statement-all.component';
import Transaction from '../models/transaction';


@Component({
  selector: 'app-account-transaction',
  templateUrl: './account-transaction.component.html',
  styleUrls: ['./account-transaction.component.css']
})
export class AccountTransactionComponent implements OnChanges {

  @Input() childTransactions: Transaction[];
  @Input() lastAccountBalance;
  
  constructor() { }

  ngOnChanges() {
   console.log('in the child component...'+ this.childTransactions);
  }
}
