import { DataSource } from "typeorm";
import { env } from "../config/env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.host || "localhost",
  port: env.port || 5432,
  database: env.name || "meetandjam",
  synchronize: false,
  url: env.url || "",
  logging: true,
  entities: ["src/db/entities/**/*.ts"],
  migrations: ["src/db/migrations/**/*.ts"],
});
