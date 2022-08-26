import http from "../axios/account-http-common";

class AccountService {
  getBankAccounts = async (bankId) => {
    return await http.get(`/getBankAccounts/${bankId}`);
  };

  allAccountTypes = async () => {
    return await http.get(`/allAccountTypes`);
  };

  allAccounts = async () => {
    return await http.get(`/allAccounts`);
  };

  createAccount = async (data) => {
    return await http.post(`/addAccount`, data);
  };
}
export default new AccountService();
