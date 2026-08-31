import { DataSource } from "typeorm";
import { env } from "../config/env";
import { User } from "./entities/user.entity";
import { Event } from "./entities/event.entity";
import { EventParticipant } from "./entities/participant.entity";
import { Tag } from "./entities/tag.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.dbHost,
  port: env.dbPort,
  username: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,

  connectTimeoutMS: 5000,

  synchronize: false,
  logging: true,
  entities: [User, Event, EventParticipant, Tag],
  migrations: ["dist/db/migrations/**/*.js"],
});
