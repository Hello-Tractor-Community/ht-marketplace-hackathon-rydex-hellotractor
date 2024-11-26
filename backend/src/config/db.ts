import { Sequelize } from "sequelize-typescript";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env file
config();

const sequelize = new Sequelize(process.env.DB_URL!, {
  schema: process.env.DB_SCHEMA,
  dialect: "postgres",
  models: [resolve(__dirname, "../models")], // Load models from the models directory
});

// new Sequelize({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   ssl: true,
//   models: [resolve(__dirname, "../models")], // Load models from the models directory
// });

export default sequelize;
