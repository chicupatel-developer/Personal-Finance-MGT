import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

////////components
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';import { BankComponent } from './bank/bank.component';
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

////////services
import { DataService } from './services/data.service';
import { LocalDataService } from './services/local-data.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DatePipe } from '@angular/common';

import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    BankComponent,
    AccountComponent,
    PayeeComponent,
    BankAddComponent,
    AccountAddComponent,
    AccountEditComponent,
    BankEditComponent,
    BankAccountListComponent,
    PayeeAddComponent,
    BankTransactionAddComponent,
    AccountStatementAllComponent,
    CreditcardComponent,
    CreditCardTransactionComponent,
    BankAcTranStatComponent,
    AccountTransactionComponent,
    AccountPayeeReportComponent,
    BankStatementComponent,
    CreditCardPayeeReportComponent,
    CcStatementComponent,
    SourceBankTransactionComponent,
    AllProjectCodingLengthComponent,
    MonitorAccountMonthlyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [HttpClientModule, LocalDataService, DataService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
