import Transaction from "./transaction";

export default class AccountStatement {   
    accountId: number;
    accountNumber: number;
    accountType: number;
    accountTypeDisplay: string;
    lastBalance: number;
    bankId: number;
    bankName: string;
    transactions: Transaction[];

    groupBy: string;
    // '',transactionDate, payeeName

    // summary report
    totalIn: number;
    totalOut: number;
    payeeTypeSummaryDisplay: string;
    startDate: Date;
    endDate: Date;
}