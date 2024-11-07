import 'dotenv/config';
import './env-loader';
import { get } from 'env-var';


export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
  JWT_SEED: get('JWT_SEED').required().asString(),
  CONSOLA_URL: get('CONSOLA_URL').required().asString(),
  API_URL: get('API_URL').required().asString(),
  AUTH_API: get('AUTH_API').required().asString(),
};
