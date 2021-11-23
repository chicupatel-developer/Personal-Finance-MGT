import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

////////components
import { HomeComponent } from './home/home.component';
import { BankComponent } from './bank/bank.component';
import { AccountComponent } from './account/account.component';
import { PayeeComponent } from './payee/payee.component';
import { BankAddComponent } from './bank-add/bank-add.component';
import { AccountAddComponent } from './account-add/account-add.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { BankEditComponent } from './bank-edit/bank-edit.component';
import { BankAccountListComponent } from './bank-account-list/bank-account-list.component';
import { PayeeAddComponent } from './payee-add/payee-add.component';
import { BankTransactionAddComponent } from './bank-transaction-add/bank-transaction-add.component';
import { AccountStatementAllComponent } from './account-statement-all/account-statement-all.component';
import { CreditcardComponent } from './creditcard/creditcard.component';
import { CreditCardTransactionComponent } from './credit-card-transaction/credit-card-transaction.component';
import { BankAcTranStatComponent } from './bank-ac-tran-stat/bank-ac-tran-stat.component';
import { AccountPayeeReportComponent } from './account-payee-report/account-payee-report.component';
import { CreditCardPayeeReportComponent } from './credit-card-payee-report/credit-card-payee-report.component';
import { SourceBankTransactionComponent } from './source-bank-transaction/source-bank-transaction.component';
import { AllProjectCodingLengthComponent } from './all-project-coding-length/all-project-coding-length.component';
import { MonitorAccountMonthlyComponent } from './monitor-account-monthly/monitor-account-monthly.component';

// child component
import { AccountTransactionComponent } from './account-transaction/account-transaction.component';
import { BankStatementComponent } from './bank-statement/bank-statement.component';
import { CcStatementComponent } from './cc-statement/cc-statement.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'bank', component: BankComponent },
  { path: 'account', component: AccountComponent },
  { path: 'payee', component: PayeeComponent },
  { path: 'bank-add', component: BankAddComponent },
  { path: 'account-add', component: AccountAddComponent },
  // { path: 'account-edit/:id', component: AccountEditComponent },
  { path: 'account-edit', component: AccountEditComponent },
  { path: 'bank-edit/:id', component: BankEditComponent },
  { path: 'bank-account-list/:id', component: BankAccountListComponent },
  { path: 'payee-add', component: PayeeAddComponent },
  { path: 'bank-transaction-add', component: BankTransactionAddComponent },
  { path: 'credit-card-transaction', component: CreditCardTransactionComponent },
  { path: 'account-statement-all', component: AccountStatementAllComponent },
  { path: 'creditcard', component: CreditcardComponent },
  { path: 'bank-ac-tran-stat', component: BankAcTranStatComponent },
  { path: 'account-payee-report', component: AccountPayeeReportComponent },
  { path: 'credit-card-payee-report', component: CreditCardPayeeReportComponent },
  { path: 'source-bank-transaction', component: SourceBankTransactionComponent },
  { path: 'all-project-coding-length', component: AllProjectCodingLengthComponent },
  { path: 'monitor-account-monthly', component: MonitorAccountMonthlyComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
