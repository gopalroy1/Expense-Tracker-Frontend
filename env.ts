
const NODE_ENV = import.meta.env.VITE_NODE_ENV;
const isProd = NODE_ENV === "prod";

export const BACKEND_BASE_URL = isProd
  ? import.meta.env.VITE_BACKEND_BASE_URL_REMOTE
  : import.meta.env.VITE_BACKEND_BASE_URL_LOCAL;
