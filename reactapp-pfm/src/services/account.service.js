import http from "../axios/account-http-common";

class BankService {
  getBankAccounts = async (bankId) => {
    return await http.get(`/getBankAccounts/${bankId}`);
  };
}
export default new BankService();
