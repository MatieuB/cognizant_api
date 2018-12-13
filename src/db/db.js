import * as fs from "fs";
import csv from "csv-parser";

import app from "../../app";
const googleConnection = "35.230.85.121";

export const knex = require("knex")({
  client: "pg",
  connection: {
    host: googleConnection,
    database: "cognizant",
    user: "matthewbouchard",
    password: "matthewbouchard",
    port: 5432
  }
});

// TODO: use path to join this path
const csvPath = "./albums.csv";

const seedDB = async filePath => {
  let results = [];

  return fs
    .createReadStream(filePath)
    .pipe(csv())
    .on("data", data => {
      results.push(data);
    })
    .on("end", async () => {
      try {
        await knex("albums").insert(results);

        console.log("Database seeded");
        app.emit("appStarted");
      } catch (err) {
        console.log("there was a problem sedding the database", err);
      }
    });
};

export const initDB = async () => {
  await knex("albums").del();
  await seedDB(csvPath);
};
