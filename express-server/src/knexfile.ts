import { Knex } from "knex";
import path from "path";

const config: Knex.Config = {
  client: "better-sqlite3",
  connection: {
    filename: path.resolve(__dirname, "../data/mockups.db"),
  },
  seeds: {
    directory: path.resolve(__dirname, "./seeds"),
  },
  useNullAsDefault: true,
};

export default config;
