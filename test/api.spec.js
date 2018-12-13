import request from "supertest";
import { expect } from "chai";

import app from "../app";

const agent = request.agent(app);
const graphqlUrl = "/graphql";

describe("-- Integration Tests --", () => {
  before(done => {
    app.on("appStarted", () => {
      console.log("appStarted");
      done();
    });
  });

  const albumFields = `{ album artist genre year id }`;

  describe("-- QUERY all --", () => {
    it("should return 103 seed albums", () => {
      const fields = `{ album artist genre year id }`;
      return agent
        .post(graphqlUrl)
        .send({ query: `query { all ${albumFields} }` })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.all.length).to.equal(103);
        });
    });
  });

  describe("-- QUERY album --", () => {
    it("should return an album if it exists", () => {
      return agent
        .post(graphqlUrl)
        .send({ query: `query { album(name: "Dangerous") ${albumFields} }` })
        .expect(200)
        .expect(({ body: { data: { album } } }) => {
          expect(album.artist).to.equal("Michael Jackson");
          expect(album.genre).to.equal("Pop");
          expect(album.year).to.equal("1991");
          expect(album.album).to.equal("Dangerous");
        });
    });

    it("should return null if not in the list", () => {
      return agent
        .post(graphqlUrl)
        .send({
          query: `query { album(name: "weird al food album") ${albumFields} }`
        })
        .expect(200)
        .expect(({ body: { data: { album } } }) => {
          expect(album).to.be.null;
        });
    });
  });

  describe("-- QUERY artists --", () => {
    const artistFields = `{ artist albumCount albums ${albumFields}}`;

    it("should return artists in order of their number of albums and then alphabetical order", () => {
      return agent
        .post(graphqlUrl)
        .send({ query: `query { artists ${artistFields} }` })
        .expect(200)
        .expect(({ body: { data: { artists } } }) => {
          expect(artists.length).to.equal(91);
          expect(artists[0].artist).to.equal("The Beatles");
          expect(artists[0].albumCount).to.equal(3);
          expect(artists[artists.length - 1].artist).to.equal("Wilco");
          expect(artists[artists.length - 1].albumCount).to.equal(1);
        });
    });
  });

  describe("-- QUERY popularGenres --", () => {
    const genreFields = `{ genre albumCount albums ${albumFields}}`;

    it("should return genres ordered by # of albums desc and alphabetically", () => {
      return agent
        .post(graphqlUrl)
        .send({ query: `query { popularGenres ${genreFields} }` })
        .expect(200)
        .expect(({ body: { data: { popularGenres } } }) => {
          expect(popularGenres.length).to.equal(18);
          expect(popularGenres[0].albumCount).to.equal(24);
          expect(popularGenres[0].genre).to.equal("Alternative");
          expect(popularGenres[popularGenres.length - 2].albumCount).to.equal(
            1
          );
          expect(popularGenres[popularGenres.length - 2].genre).to.equal("R&B");
          expect(popularGenres[popularGenres.length - 1].albumCount).to.equal(
            1
          );
          expect(popularGenres[popularGenres.length - 1].genre).to.equal(
            "Shoegaze"
          );
        });
    });
  });

  describe("-- QUERY popularYears --", () => {
    const yearFields = `{ year albumCount albums ${albumFields}}`;

    it("should return years ordered by # of albums desc and chronologically", () => {
      return agent
        .post(graphqlUrl)
        .send({ query: `query { popularYears ${yearFields} }` })
        .expect(200)
        .expect(({ body: { data: { popularYears } } }) => {
          expect(popularYears.length).to.equal(46);
          expect(popularYears[0].albumCount).to.equal(9);
          expect(popularYears[0].year).to.equal("2016");
          expect(popularYears[popularYears.length - 3].albumCount).to.equal(1);
          expect(popularYears[popularYears.length - 3].year).to.equal("2006");
          expect(popularYears[popularYears.length - 2].albumCount).to.equal(1);
          expect(popularYears[popularYears.length - 2].year).to.equal("2008");
          expect(popularYears[popularYears.length - 1].albumCount).to.equal(1);
          expect(popularYears[popularYears.length - 1].year).to.equal("2011");
        });
    });
  });
});
