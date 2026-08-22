import { config } from "dotenv";

config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  host: process.env.HOST ?? "0.0.0.0",
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET ?? "",

  // DB
  dbHost: process.env.DB_HOST ?? "localhost",
  dbPort: Number(process.env.DB_PORT) || 5432,
  dbUser: process.env.DB_USER ?? "postgres",
  dbPassword: process.env.DB_PASSWORD ?? "postgres",
  dbName: process.env.DB_NAME ?? "meetandjam-db",
};

export const validateEnv = () => {
  if (!env.jwtSecret) throw new Error("JWT_SECRET is not defined in .env");
};
