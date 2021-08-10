import axios from "axios";
import endpoints from "./endpoints";
const headers = {
  "Content-Type": "application/json;charset=utf-8",
};

export const corsBridge = axios.create({
  baseURL: endpoints.CORS_BRIDGE,
  headers,
});

export const paymobApi = axios.create({
  baseURL: endpoints.PAYMOB_API,
  headers,
});
