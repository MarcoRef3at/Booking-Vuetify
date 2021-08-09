import axios from "axios";
const apiClient = axios.create({
  baseURL: "http://192.168.1.99:5000/",
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
});

export default apiClient;
