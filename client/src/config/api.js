const configuredServerUrl = import.meta.env.VITE_SERVER_URL?.trim().replace(/\/+$/, "");

export const API_URL =
  configuredServerUrl || (import.meta.env.DEV ? "http://localhost:8055" : "");
