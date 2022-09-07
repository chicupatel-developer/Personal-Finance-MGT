import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:44313/api/CodingLength",
  headers: {
    "Content-type": "application/json",
  },
});
