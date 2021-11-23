import Transaction from "./transaction";
export default class BankAccount {
    accountId: number;
    accountNumber: number;
    accountType: number;
    lastBalance: number;

    accountTypeDisplay: string;
    transactions: Transaction[];

    accountColor: string;

    totalEllapseDays : number;

    // account summary report
    totalIn: number;
    totalOut: number;
    payeeTypeSummaryDisplay: string;
    startDate: Date;
    endDate: Date;
  
}