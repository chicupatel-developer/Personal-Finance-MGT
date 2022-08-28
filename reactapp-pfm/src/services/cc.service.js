import http from "../axios/cc-http-common";

class CCService {
  allCCs = async () => {
    return await http.get(`/allCCs`);
  };
}
export default new CCService();
