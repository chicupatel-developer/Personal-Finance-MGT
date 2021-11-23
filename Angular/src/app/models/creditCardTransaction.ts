// CreditCardTransaction.cs
export default class CreditCardTransaction {
    creditCardTransactionId: number;
    creditCardId: number; // payeeId of selected cc by which payment is done - source     
    payeeId: number; // payeeeId of selected payee to which payment is done - destination
    transactionAmount: number;
    transactionDate: Date;
    ccColor: string;
    balance: number;
    ccAccountNumber: string;
}