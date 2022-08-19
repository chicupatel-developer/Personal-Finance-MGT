import http from "../axios/payee-http-common";

class PayeeService {
  allPayeeTypes = async () => {
    return await http.get(`/allPayeeTypes`);
  };

  allPayees = async () => {
    return await http.get(`/allPayees`);
  };
  createPayee = async (data) => {
    return await http.post(`/addPayee`, data);
  };

}
export default new PayeeService();
