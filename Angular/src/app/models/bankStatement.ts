import BankAccount from "./bankAccount";

export default class BankStatement {
    bankId: number;
    bankName: string;
    bankAccounts: BankAccount[];

    bankColor: string;

    bankTotalEllapseDays: number;

    // bank summary report
    totalIn: number;
    totalOut: number;
    payeeTypeSummaryDisplay: string;
    startDate: Date;
    endDate: Date;
}