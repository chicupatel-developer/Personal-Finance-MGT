// BankTransaction.cs
export default class BankTransaction {
    bankTransactionId: number;
    bankId: number;
    accountId: number;
    accountNumber: number;
    payeeId: number;
    transactionAmount: number;
    transactionDate: Date;
    bankColor: string;
    accountColor: string;   

    balance: number;
    bankName: string;    

    sourceId : number;
}