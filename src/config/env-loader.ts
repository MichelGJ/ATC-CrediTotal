import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
const envFilePath = path.resolve(process.cwd(), `.env.${env}`);

if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
} else {
  console.warn(`Environment file ${envFilePath} not found. Loading default .env if available.`);
  dotenv.config(); // fallback to .env if specific file doesn't exist
}