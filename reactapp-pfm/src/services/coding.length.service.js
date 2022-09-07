import http from "../axios/coding-length-http-common";

class CodingLengthService {
  getAllProjectCodingLength = async () => {
    return await http.get(`/getAllProjectCodingLength`);
  };
}
export default new CodingLengthService();
