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

    it("should be case insenstive", () => {
      return agent
        .post(graphqlUrl)
        .send({
          query: `query { album(name: "dangerous") ${albumFields} }`
        })
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

  describe("-- QUERY artist --", () => {
    const artistResponse = {
      artist: "Michael Jackson",
      albumCount: 2,
      albums: [
        {
          album: "Thriller",
          year: "1982",
          genre: "Pop"
        },
        {
          album: "Dangerous",
          year: "1991",
          genre: "Pop"
        }
      ]
    };

    it("should return an artist with their albums", () => {
      return agent
        .post(graphqlUrl)
        .send({
          query: `query { artist(name: "Michael Jackson") { artist albumCount albums { album year genre } }}`
        })
        .expect(200)
        .expect(({ body: { data: { artist } } }) => {
          expect(artist).to.deep.equal(artistResponse);
        });
    });

    it("should be case insenstive", () => {
      return agent
        .post(graphqlUrl)
        .send({
          query: `query { artist(name: "michael jackson") { artist albumCount albums { album year genre } }}`
        })
        .expect(200)
        .expect(({ body: { data: { artist } } }) => {
          expect(artist).to.deep.equal(artistResponse);
        });
    });

    it("return null if an artist does not exist", () => {
      return agent
        .post(graphqlUrl)
        .send({
          query: `query { artist(name: "michael pollan") { artist albumCount albums { album year genre } }}`
        })
        .expect(200)
        .expect(({ body: { data: { artist } } }) => {
          expect(artist).to.be.null;
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

  describe("-- MUTATION newAlbum --", () => {
    const testAlbum = {
      album: "get schifty",
      artist: "rick sanchez",
      genre: "dance",
      year: "2016"
    };

    const albumMutation = `mutation{
      newAlbum(newAlbum: {
        album: "get schifty",
        artist: "rick sanchez",
        year: "2016",
        genre: "dance"
      }){
        success
        error
        album { artist year genre album }
        created
        removed
        updated
      }
  }`;
    it("should add a new album to the db", () => {
      agent
        .post(graphqlUrl)
        .send({ query: albumMutation })
        .expect(200)
        .expect(({ body: { data: { newAlbum } } }) => {
          expect(newAlbum).to.deep.equal({
            success: true,
            error: false,
            album: testAlbum,
            created: 1,
            updated: null,
            removed: null
          });
        });
      agent
        .post(graphqlUrl)
        .send({ query: `query { all ${albumFields}}` })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.all.length).to.equal(104);
        });
    });
  });

  describe("-- MUTATION deleteAlbum --", () => {
    const albumMutation = id => `mutation {
      deleteAlbum(id: ${id}){
        success
        error
        album { artist id }
        created
        removed
        updated
      }
  }`;
    it("should delete by id", () => {
      let album;

      return agent
        .post(graphqlUrl)
        .send({ query: `query { all { id album }}` })
        .expect(200)
        .expect(({ body: { data: { all } } }) => {
          expect(all.length).to.equal(103);
          album = all[0];
        });
      agent
        .post(graphqlUrl)
        .send({ query: albumMutation(album.id) })
        .expect(200)
        .expect(({ body: { data: { deleteAlbum } } }) => {
          expect(deleteAlbum).to.deep.equal({
            album,
            success: true,
            error: false,
            created: null,
            updated: null,
            removed: 1
          });
        });
      agent
        .post(graphqlUrl)
        .send({ query: `query { all { id album }}` })
        .expect(200)
        .expect(({ body: { data: { all } } }) => {
          expect(all.length).to.equal(102);
        });
    });
  });

  describe("-- MUTATION update --", () => {
    const testAlbum = {
      album: "get schifty",
      artist: "rick sanchez",
      genre: "dance",
      year: "2016"
    };

    const albumMutation = id => `mutation{
        update(id: ${id}, updates: {
          album: "get down",
          artist: "morty",
          year: "3000",
          genre: "dance"
        }){
          success
          error
          album { artist year genre album }
          created
          removed
          updated
        }
    }`;
    const update = {
      artist: "morty",
      year: "3000",
      genre: "dance",
      album: "get down"
    };

    it("should update by id", () => {
      let album;
      return agent
        .post(graphqlUrl)
        .send({ query: `query { all { id album }}` })
        .expect(200)
        .expect(({ body: { data: { all } } }) => {
          album = all[0];
        });
      agent
        .post(graphqlUrl)
        .send({ query: albumMutation(album.id) })
        .expect(200)
        .expect(({ body: { data: { update } } }) => {
          expect(update).to.deep.equal({
            album: update,
            success: true,
            error: false,
            created: null,
            updated: 1,
            removed: 1
          });
        });
      agent
        .post(graphqlUrl)
        .send({ query: `query { album(name: "get down") ${albumFields} }` })
        .expect(200)
        .expect(({ body: { data: { album } } }) => {
          expect(album).to.equal(update);
        });
    });
  });
});
