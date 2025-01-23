import type { Knex } from "knex";

export async function seed(knex: Knex) {
  if (!(await knex.schema.hasTable("mockups")))
    await knex.schema.createTable("mockups", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.json("tags").notNullable();
      table.string("directory").notNullable();
      table.json("colors").notNullable();
    });
  else await knex("mockups").truncate();

  if (!(await knex.schema.hasTable("licenses")))
    await knex.schema.createTable("licenses", (table) => {
      table.string("key").primary().notNullable();
    });
  else await knex("licenses").truncate();

  await knex("licenses").insert({ key: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" });
  return await knex("mockups").insert([
    {
      id: 1,
      name: "Samsung Tablet",
      tags: '["tablet","woman","samsung"]',
      directory: "Samsung_Tablet",
      colors: '[{ "hex": "#000000", "src": "device.png" }]',
    },
    {
      id: 2,
      name: "Apple Watch",
      tags: '["apple watch","nature","hand"]',
      directory: "AppleWatch_LHand",
      colors:
        '[{ "hex": "#6183b9", "src": "blue.png" }, { "hex": "#a35791", "src": "magenta.png" }, { "hex": "#bea86c", "src": "yellow.png" }]',
    },
    {
      id: 3,
      name: "iPhone Black Stones",
      tags: '["iphone","nature"]',
      directory: "iPhone_Black_Stones",
      colors: '[{ "hex": "#000000", "src": "device.png" }]',
    },
  ]);
}
