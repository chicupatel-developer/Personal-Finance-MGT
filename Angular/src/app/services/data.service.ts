import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Bank from '../models/bank';
import { LocalDataService } from '../services/local-data.service';
import Account from '../models/account';
import BankAccountVM from '../models/bankAccountVM';
import Payee from '../models/payee';
import AccountType from '../models/accountType';
import CreditCard from '../models/creditCard';
import Source from '../models/source';
import AccountMonthly from '../models/accountMonthly';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public API = 'https://localhost:44313';
  public BANK_API = `${this.API}/api/bank`;
  public ACCOUNT_API = `${this.API}/api/account`;
  public PAYEE_API = `${this.API}/api/payee`;
  public CC_API = `${this.API}/api/creditcard`;
  public BANKTRANSACTION_API = `${this.API}/api/banktransaction`;
  public SOURCE_API = `${this.API}/api/source`;
  public CODINGLENGTH_API = `${this.API}/api/codinglength`;
  public ENTITYMONITOR_API = `${this.API}/api/entitymonitor`;

  constructor(private http: HttpClient, public localDataService: LocalDataService) { }

  ///////////////// FMS api
  // ok
  //////////// bank transaction
  // list payees for select list in bank-transaction-add create form
  listOfPayees(): Observable<Array<Payee>> {
    return this.http.get<Array<Payee>>(this.BANKTRANSACTION_API + '/listOfPayees');
  }
  // add bank-transaction
  addBankTransaction(bankTransaction): Observable<any> {
    return this.http.post(this.BANKTRANSACTION_API + '/addBankTransaction', bankTransaction)
  }
  // get account-statement
  getAccountStatementAll(accountVM): Observable<any> {
    return this.http.post(this.BANKTRANSACTION_API + '/getAccountStatementAll', accountVM)
  }   
  // get all-accounts-payee report
  // get bank-statement
  getBankStatement(bank): Observable<any> {
    return this.http.post(this.BANKTRANSACTION_API + '/getbankStatement', bank)
  }


  //////////// bank
  // list bank
  getBanks(): Observable<Array<Bank>> {
    return this.http.get<Array<Bank>>(this.BANK_API + '/allBanks');
  }
  // add bank
  addBank(bankModel): Observable<any> {
    return this.http.post(this.BANK_API + '/addBank', bankModel)
  }
  // edit bank
  getBank(selectedBankId: number): Observable<Bank> {
    return this.http.get<Bank>(this.BANK_API + '/getBank/' + selectedBankId);
  }
  // edit bank in action
  editBank(data): Observable<any> {
    return this.http.post(this.BANK_API + '/editBank', data);
  }



  //////////// account
  // list account types
  getAccountTypes(): Observable<Array<string>> {
    return this.http.get<Array<string>>(this.ACCOUNT_API + '/allAccountTypes');
  }
  // list account
  getAccounts(): Observable<Array<Account>> {
    return this.http.get<Array<Account>>(this.ACCOUNT_API + '/allAccounts');
  }
  // add account
  addAccount(accountModel): Observable<any> {
    return this.http.post(this.ACCOUNT_API + '/addAccount', accountModel)
  }
  // edit account
  getAccount(selectedAcId: number): Observable<Account> {
    return this.http.get<Account>(this.ACCOUNT_API + '/getAccount/' + selectedAcId);
  }
  // edit account in action
  editAccount(data): Observable<any> {
    return this.http.post(this.ACCOUNT_API + '/editAccount', data);
  }
  // list bank account
  getBankAccounts(bankId: number): Observable<BankAccountVM> {
    return this.http.get<BankAccountVM>(this.ACCOUNT_API + '/getBankAccounts/' + bankId);
  }

  //////////// payee
  // list payee types
  getPayeeTypes(): Observable<Array<string>> {
    return this.http.get<Array<string>>(this.PAYEE_API + '/allPayeeTypes');
  }
  // list payee
  getPayees(): Observable<Array<Payee>> {
    return this.http.get<Array<Payee>>(this.PAYEE_API + '/allPayees');
  }
  // add payee
  addPayee(payeeModel): Observable<any> {
    return this.http.post(this.PAYEE_API + '/addPayee', payeeModel)
  }
  // list payee type of CC
  getPayeesCC(): Observable<Array<Payee>> {
    return this.http.get<Array<Payee>>(this.PAYEE_API + '/allPayeesCC');
  }

  //////////// credit-card
  // list credit-card
  getCCs(): Observable<Array<CreditCard>> {
    return this.http.get<Array<CreditCard>>(this.CC_API + '/allCCs');
  }
  // get cc-statement
  // credit - card - payee - report
  getCreditCardStatementAll(cc): Observable<any> {
    return this.http.post(this.CC_API + '/getCCStatementAll', cc);
  }
  // add cc-transaction
  addCCTransaction(ccTransaction): Observable<any> {
    return this.http.post(this.CC_API + '/addCCTransaction', ccTransaction)
  }

  //////////// source
  // list source
  getSources(): Observable<Array<Source>> {
    return this.http.get<Array<Source>>(this.SOURCE_API + '/allSources');
  }
  // source to bank transaction
  bankInputFromSource(bankTransaction): Observable<any> {
    return this.http.post(this.SOURCE_API + '/bankInputFromSource', bankTransaction)
  }

  //////////// all-project-line-count
  // get - all-project-line-count
  getAllProjectCodingLength(): Observable<Array<any>> {
    return this.http.get<Array<any>>(this.CODINGLENGTH_API + '/getAllProjectCodingLength');
  }

  //////////// entity-monitor
  // monitor-Account-Monthly
  monitorAccountMonthly(accountMonthlyRequest): Observable<Array<AccountMonthly>> {
    return this.http.post<Array<AccountMonthly>>(this.ENTITYMONITOR_API + '/monitorAccountMonthly', accountMonthlyRequest);
  }
}
