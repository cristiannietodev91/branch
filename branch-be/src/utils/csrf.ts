import { csrfSync } from "csrf-sync";

const { csrfSynchronisedProtection, generateToken } = csrfSync();

export default {
  csrfSynchronisedProtection,
  generateToken,
};