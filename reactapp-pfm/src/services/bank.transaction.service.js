import http from "../axios/bank-transaction-http-common";

class BankTransactionService {
  listOfPayees = async () => {
    return await http.get(`/listOfPayees`);
  };

  addBankTransaction = async (data) => {
    return await http.post(`/addBankTransaction`, data);
  };

  getAccountStatementAll = async (data) => {
    return await http.post(`/getAccountStatementAll`, data);
  };

  // report
  // all-accounts-all-payees
  // all-accounts-selected-payee
  getBankStatement = async (data) => {
    return await http.post(`/getBankStatement`, data);
  };

  // report
  // selected-account-all-payees
  // selected-account-selected-payee
  getAccountStatementAll = async (data) => {
    return await http.post(`/getAccountStatementAll`, data);
  };
}
export default new BankTransactionService();
