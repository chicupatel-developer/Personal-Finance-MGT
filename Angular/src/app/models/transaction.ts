export default class Transaction {
    bankTransactionId: number;
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

    // decides $In or $Out
    transactionType: number;
    transactionTypeDisplay: string;

    refCode: string;

    sourceId : number;
    sourceName : string;

}