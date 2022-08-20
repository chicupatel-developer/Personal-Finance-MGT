import http from "../axios/account-http-common";

class AccountService {
  getBankAccounts = async (bankId) => {
    return await http.get(`/getBankAccounts/${bankId}`);
  };

  allAccountTypes = async () => {
    return await http.get(`/allAccountTypes`);
  };
}
export default new AccountService();
