
export default class CreditCardStatement {
    creditCardId: number;
    creditCardNumber: string;
    creditCardName : string;
    payeeType: number;
    payeeTypeDisplay: string;
    balance: number;
    transactions: Transaction[];

    groupBy: string;
    // '',transactionDate, payeeName

    ccColor : string;

    // summary report
    totalIn: number;
    totalOut: number;
    payeeTypeSummaryDisplay: string;
    startDate: Date;
    endDate: Date;
}

class Transaction {
   
    creditCardTransactionId: number;
    payeeId: number;
    payeeName: string;
    payeeType: number;
    payeeTypeDisplay: string;
    amountPaid: number;
    transactionDate: Date;
    transactionStatus: number;
    lastBalance: number;
    currentBalance: number;

    transactionDateString: string;

    bankId : number;
    bankName : string;
    accountId: number;
    accountNumber : number;

    // decides $In or $Out
    transactionType : number;
    transactionTypeDisplay : string;

    refCode : string;
}