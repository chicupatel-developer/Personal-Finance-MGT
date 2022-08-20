import http from "../axios/source-to-bank-transaction-http-common";

class SourceToBankTransactionService {
  allSources = async () => {
    return await http.get(`/allSources`);
  };

  bankInputFromSource = async (data) => {
    return await http.post(`/bankInputFromSource`, data);
  };
}
export default new SourceToBankTransactionService();
