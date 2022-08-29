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

  getBankStatement = async (data) => {
    return await http.post(`/getBankStatement`, data);
  };
}
export default new BankTransactionService();
