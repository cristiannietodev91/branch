import axios from "axios";
import { apiBranchUrl } from "./constants/config";

export default axios.create({
  baseURL: apiBranchUrl,
  headers: {
    "Content-type": "application/json"
  }
});
