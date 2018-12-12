import * as fs from "fs";
import csv from "csv-parser";

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
const csvPath = "/Users/matthewbouchard/workspace/cognizant_api/albums.csv";

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
        // await database.albums.insert(results);
        await knex("albums").insert(results);
      } catch (err) {
        console.log("probelms with SEEDING", err);
      }
    });
};

export const initDB = async () => {
  await knex("albums").del();
  await seedDB(csvPath);
};

initDB();
