import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { DataService } from '../services/data.service';
import AccountMonthly from '../models/accountMonthly';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Part from '../models/part';
import Series from '../models/series';
import Bank from '../models/bank';
import Account from '../models/account';
import AccountVM from '../models/accountVM';
import AccountType from '../models/accountType';
import AccountMonthlyRequest from '../models/accountMonthlyRequest';

@Component({
  selector: 'app-monitor-account-monthly',
  templateUrl: './monitor-account-monthly.component.html',
  styleUrls: ['./monitor-account-monthly.component.css']
})
export class MonitorAccountMonthlyComponent implements OnInit {

  accountMonthlyParams = {
    name : 'Account Monthly',
    width : 700,
    height : 500,
    xAxisLabel : 'Month',
    yAxisLabel : '$$.$$',
    showYAxisLabel : true,
    showXAxisLabel : true,
    showXAxis : true,
    showYAxis : true,
    gradient : true,
    showLegend : true
  };

  fitContainer: boolean = false;
  colorScheme = {
    domain: ['green', 'red', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };

  // selected account
  // monitor account's monthly total In/Out
  accountMonthlyRequest : AccountMonthlyRequest;
  public multiIn = [];
  public multiOut = [];
  public multiInOut = [];
  public multiFinal = [];
  public chartData = [];
  accountMonthly: AccountMonthly[];

  // controls visibilty of chart panel display
  showAnyAccountChart : boolean = false;
  noTransactions : boolean = false;
  banks: Array<Bank>;
  accounts: Array<AccountVM>;
  accountMonitorReportForm: FormGroup;
  submitted = false;
  accountTypesName: string[];
  accountTypesCollection: AccountType[];
  
  selectedBank : string = '';
  selectedAccount : string = '';
  totalIn : number = 0;
  totalOut : number = 0;
  
  constructor(private fb: FormBuilder, public localDataService: LocalDataService, public dataService: DataService, private router: Router) { }

  // ok
  ngOnInit() {   
    this.initMonitorAccountMonthly();

    this.accountTypesName = [];
    this.accountTypesCollection = [];

    this.accountMonitorReportForm = this.fb.group({
      BankId: ['', Validators.required],
      AccountId: ['', Validators.required]
    });

    this.loadAccountTypes();
    this.loadBank();
  }

  // ok
  loadAccountTypes() {
    this.dataService.getAccountTypes()
      .subscribe(
        data => {
          this.accountTypesName = data;
          this.accountTypesCollection = this.localDataService.getAccountTypeCollection(this.accountTypesName);
        },
        error => {
          console.log(error);
        });
  }
  // ok
  loadBank() {
    this.dataService.getBanks()
      .subscribe(
        data => {
          this.banks = data;
        },
        error => {
          console.log(error);
        });
  } 
  // ok
  changeBank(event) {
    if (event.target.value == "") {
      this.resetSelectList();
      return;
    }
    else {
      this.resetSelectList();      
      this.loadAccounts(event.target.value);      
    }
  } 
  // ok
  // reset account select list
  resetSelectList() {
    this.accounts = [];
    this.accountMonitorReportForm.get("AccountId").patchValue("");
  }
  // ok
  loadAccounts(selectedBankId) {
    this.dataService.getBankAccounts(selectedBankId)
      .subscribe(
        data => {
          if (data.accounts.length <= 0) {
            this.accountMonitorReportForm.controls['AccountId'].setValue('');
          }
          this.accounts = data.accounts;
        },
        error => {
          console.log(error);
        });
  }
  // ok
  // convert int to string from AccountType[]
  displayAccountType(acType) {
    var filterByAccountType = this.accountTypesCollection.filter(xx => xx.indexValue == acType);
    if (filterByAccountType != null) {
      return filterByAccountType[0].accountType;
    }
    else {
      return -1;
    }
  }

  // ok
  initMonitorAccountMonthly(){
    this.accountMonthlyRequest = new AccountMonthlyRequest();
    this.accountMonthly = [];
    this.multiIn = [];
    this.multiOut = [];
    this.multiInOut = [];
    this.multiFinal = [];
    this.chartData = [];
    this.selectedBank = '';
    this.selectedAccount = '';
    this.totalIn = 0;
    this.totalOut = 0;
  }
  // ok
  getMonthName(monthNumber){
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[monthNumber - 1];
  }
  // ok
  getTransactionType(tranType) {
    var tranTypes = ['+$ In', '-$ Out'];
    return tranTypes[tranType];
  }

  // ok
  // total In / total Out account wise
  monitorAccountMonthly(){
    this.submitted = true;
    this.initMonitorAccountMonthly();

    if (this.accountMonitorReportForm.valid) {

      let map = new Map<string, Series[]>();
      this.accountMonthlyRequest.bankId = Number(this.accountMonitorReportForm.value["BankId"]);
      this.accountMonthlyRequest.accountId = Number(this.accountMonitorReportForm.value["AccountId"]);
      
      this.dataService.monitorAccountMonthly(this.accountMonthlyRequest)
        .subscribe(
          data => {
            console.log(data);
            if(data.length>0){
              this.accountMonthly = data;
              this.totalIn= 0;
              this.totalOut = 0;
              var allIn = this.accountMonthly.filter(xx => xx.tranType == 0);
              var allOut = this.accountMonthly.filter(xx => xx.tranType == 1);
              allIn.forEach((element) => {
                this.totalIn+=element.total;
              });
              allOut.forEach((element) => {
                this.totalOut += element.total;
              });


              // group by month
              var dataByMonth = this.accountMonthly.reduce((acc, value) => {
                // Group initialization
                if (!acc[value.month]) {
                  acc[value.month] = [];
                }
                // Grouping
                acc[value.month].push(value);
                return acc;
              }, {});
              for (var key in dataByMonth) {
                // console.log("group by #" + key);
              }
              var allParts = [];       
              this.chartData = [];
              for (let prop in dataByMonth) {
                if (dataByMonth[prop].length === 2) {
                  var part = new Part();                  
                  part.series = [];
                  // part.name = prop+"";
                  part.name = this.getMonthName(Number(prop));
                  for (let data in dataByMonth[prop]) {
                    var series = new Series();
                    console.log('data,,,', data);
                    // dataByMonth[prop][data].total
                    if (dataByMonth[prop][data].tranType == 0) {
                      series.name = "+$ In";  
                    }
                    else {
                      series.name = "-$ Out";
                    }                    
                    series.value = dataByMonth[prop][data].total;

                    part.series.push(series);
                  }                  
                }
                else {
                  var part = new Part();                  
                  part.series = [];
                  // part.name = prop + "";
                  part.name = this.getMonthName(Number(prop));
                  for (let data in dataByMonth[prop]) {
                    var series = new Series();
                    if (dataByMonth[prop][data].tranType == 0) {
                      series.name = "+$ In";  
                      series.value = dataByMonth[prop][data].total;
                      part.series.push(series);

                      series = new Series();
                      series.name = "-$ Out";  
                      series.value = 0;
                      part.series.push(series);
                    }
                    else {
                      series.name = "+$ In";  
                      series.value = 0;
                      part.series.push(series);

                      series = new Series();
                      series.name = "-$ Out";
                      series.value = dataByMonth[prop][data].total;
                      part.series.push(series);
                    }    
                  }
                }
                this.chartData.push(part);
              }
              console.log('chart data,,,',this.chartData);






  
              /*
              this.accountMonthly.forEach((element) => {
                var part = new Part();
                var series = new Series();
                part.series = [];

                part.name = this.getMonthName(element.month);
                series.name = this.getTransactionType(element.tranType);
                series.value = element.total;
                part.series.push(series);
                if (element.tranType == 0) {
                  this.multiIn.push(part);
                }
                else {
                  this.multiOut.push(part);
                }
              });
              */
              // this.multiInOut = [...this.multiIn, ...this.multiOut];

              // console.log(this.multiIn);
              // console.log(this.multiOut);
              // console.log(this.multiInOut);

              /*
              const map = new Map();
              this.multiFinal = [];

              for (const item of this.multiInOut) {
                if (!map.has(item.name)) {
                  map.set(item.name, true);
                  this.multiFinal.push(item);
                }
                else {
                  this.multiFinal.forEach((element) => {
                    if (element.name == item.name) {
                      element.series.push(item.series[0]);
                    }
                  });
                }
              }
              */
              console.log('check ,,,',this.multiFinal);
              this.selectedBank = this.accountMonthly[0].bankName;
              this.selectedAccount = this.accountMonthly[0].accountNumber + ' [ ' + this.displayAccountType(this.accountMonthly[0].accountType)+' ]';
          
              this.showAnyAccountChart = true;
              this.noTransactions = false;
            }
            else{
              this.showAnyAccountChart = false;
              this.noTransactions = true;
            }  
          },
          error => {
            console.log(error);
          });
    }
    else{
      this.initMonitorAccountMonthly();
      this.showAnyAccountChart = false;
      this.noTransactions = true;
    }

  }

  // ok
  public handleError = (controlName: string, errorName: string) => {
    return this.accountMonitorReportForm.controls[controlName].hasError(errorName);
  }
  // ok
  reset() {
    this.accountMonitorReportForm.reset();
    this.submitted = false;
    this.resetSelectList();
    this.initMonitorAccountMonthly();
    this.showAnyAccountChart = false;
  }
  // ok
  get accountMonitorReportFormControl() {
    return this.accountMonitorReportForm.controls;
  }

  // ok
  goBack() {
    this.router.navigate(['/home']);
  }
}
