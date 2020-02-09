import axios from "axios";
import { apiBranchUrl } from "./constants/config";

//TODO: Pending load url from environment variable
console.log('Backservcies URl ::::>',apiBranchUrl) // eslint-disable-line no-console

export default axios.create({
  baseURL: apiBranchUrl,
  headers: {
    "Content-type": "application/json"
  }
});
