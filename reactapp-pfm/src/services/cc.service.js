import http from "../axios/cc-http-common";

class CCService {
  allCCs = async () => {
    return await http.get(`/allCCs`);
  };

  addCCTransaction = async (data) => {
    return await http.post(`/addCCTransaction`, data);
  };

  getCCStatementAll = async (data) => {
    return await http.post(`/getCCStatementAll`, data);
  };
}
export default new CCService();
