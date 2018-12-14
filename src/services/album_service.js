import { groupBy, orderBy } from "lodash";

import { knex } from "../db/db.js";

export const all = async () => await knex("albums");

const parseByField = async field => {
  const allAlbums = await all();
  const temp = groupBy(allAlbums, field);
  const keys = Object.keys(temp);
  const results = keys.map(key => ({
    [field]: key,
    albums: temp[key],
    albumCount: temp[key].length
  }));

  return orderBy(results, ["albumCount", "artist"], ["desc", "asc"]);
};

export const artists = async () => {
  return parseByField("artist");
};

export const getArtist = async name => {
  const records = await knex("albums").where(
    knex.raw('LOWER("artist") = ? ', name.toLowerCase())
  );

  return {
    artist: records[0].artist,
    albumCount: records.length,
    albums: records
  };
};

export const newAlbum = async newAlbum => {
  const [insertResult] = await knex("albums")
    .insert(newAlbum)
    .returning("*");

  return {
    success: true,
    error: false,
    created: 1,
    album: insertResult
  };
};

export const getAlbum = async name => {
  const [foundAlbum] = await knex("albums").where(
    knex.raw('LOWER("album") = ? ', name.toLowerCase())
  );

  return foundAlbum;
};

export const deleteAlbum = async id => {
  const [deletedAlbum] = await knex("albums")
    .delete()
    .where({ id })
    .returning("*");

  return {
    success: true,
    removed: 1,
    error: false,
    album: deletedAlbum
  };
};

export const updateAlbum = async (id, updates) => {
  const [updatedAlbum] = await knex("albums")
    .where({ id })
    .update(updates)
    .returning("*");

  return {
    success: true,
    updated: 1,
    error: false,
    album: updatedAlbum
  };
};

export const getPopularGenres = () => parseByField("genre");

export const getAlbumsByYear = () => parseByField("year");
