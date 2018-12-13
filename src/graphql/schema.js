// import { gql } from "apollo-server-express";
// import { makeExecutableSchema } from "apollo-server";

// import * as albumService from "../services/album_service.js";

// const SchemaDefinition = gql`
//   schema {
//     query: RootQuery
//     mutation: RootMutation
//   }
// `;

// const QueryTypes = `
//   hello: String
//   "Returns a list of all albums"
//   all: [Album]
//   "Returns a list of unique artists with their albums"
//   artists: [Artist]
//   album(name: String!): Album
//   popularGenres: [Genre]
//   popularYears: [Year]
// `;

// const MutationTypes = `
//   new(newAlbum: AlbumInput!): Response
//   delete(id: String!): Response
//   update(id: String!, updates: AlbumInput ): Response
// `;

// const RootQueryType = gql`
//   type RootQuery {
//     ${QueryTypes}
//   }
// `;

// const RootMutationType = gql`
//   type RootMutation {
//     ${MutationTypes}
//   }
// `;

// const ArtistType = gql`
//   type Artist {
//     artist: String
//     albumCount: Int
//     albums: [Album]
//   }
// `;

// const GenreType = gql`
//   type Genre {
//     genre: String
//     albumCount: Int
//     albums: [Album]
//   }
// `;

// const YearType = gql`
//   type Year {
//     year: String
//     albumCount: Int
//     albums: [Album]
//   }
// `;

// const AlbumInputType = gql`
//   input AlbumInput {
//     album: String
//     genre: String
//     artist: String
//     year: String
//   }
// `;

// const AlbumType = gql`
//   type Album {
//     id: String!
//     album: String
//     genre: String
//     artist: String
//     year: String
//   }
// `;

// const ResponseType = gql`
//   type Response {
//     success: Boolean!
//     error: Boolean!
//     album: Album
//     created: Int
//     removed: Int
//     updated: Int
//   }
// `;

// const queryResolvers = {
//   RootQuery: {
//     hello: () => "Hello world!",
//     all: () => {
//       return albumService.all();
//     },
//     artists: () => albumService.artists(),
//     album: (_, { name }) => albumService.getAlbum(name),
//     popularGenres: () => albumService.getPopularGenres(),
//     popularYears: () => albumService.getAlbumsByYear()
//   }
// };
// const mutationResolvers = {
//   RootMutation: {
//     new: (_, { newAlbum }) => albumService.newAlbum(newAlbum),
//     delete: (_, { id }) => albumService.deleteAlbum(id),
//     update: (_, { id, updates }) => albumService.updateAlbum(id, updates)
//   }
// };

// export const schema = makeExecutableSchema({
//   typeDefs: [
//     SchemaDefinition,
//     RootQueryType,
//     RootMutationType,
//     AlbumType,
//     AlbumInputType,
//     ArtistType,
//     GenreType,
//     YearType,
//     ResponseType
//   ],
//   resolvers: [queryResolvers, mutationResolvers]
// });

import { gql } from "apollo-server-express";
import { makeExecutableSchema } from "apollo-server";

import * as albumService from "../services/album_service.js";

const SchemaDefinition = gql`
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

const QueryTypes = `
  hello: String
  "Returns a list of all albums"
  all: [Album]
  "Returns a list of unique artists with their albums"
  artists: [Artist]
  album(name: String!): Album
  popularGenres: [Genre]
  popularYears: [Year]
`;

const MutationTypes = `
  new(newAlbum: AlbumInput!): Response
  delete(id: String!): Response
  update(id: String!, updates: AlbumInput ): Response
`;

const RootQueryType = gql`
  type RootQuery {
    ${QueryTypes}
  }
`;

const RootMutationType = gql`
  type RootMutation {
    ${MutationTypes}
  }
`;

const ArtistType = gql`
  type Artist {
    artist: String
    albumCount: Int
    albums: [Album]
  }
`;

const GenreType = gql`
  type Genre {
    genre: String
    albumCount: Int
    albums: [Album]
  }
`;

const YearType = gql`
  type Year {
    year: String
    albumCount: Int
    albums: [Album]
  }
`;

const AlbumInputType = gql`
  input AlbumInput {
    album: String
    genre: String
    artist: String
    year: String
  }
`;

const AlbumType = gql`
  type Album {
    id: String!
    album: String
    genre: String
    artist: String
    year: String
  }
`;

const ResponseType = gql`
  type Response {
    success: Boolean!
    error: Boolean!
    album: Album
    created: Int
    removed: Int
    updated: Int
  }
`;

const queryResolvers = {
  RootQuery: {
    hello: () => "Hello world!",
    all: () => albumService.all(),
    artists: () => albumService.artists(),
    album: (_, { name }) => albumService.getAlbum(name),
    popularGenres: () => albumService.getPopularGenres(),
    popularYears: () => albumService.getAlbumsByYear()
  }
};
const mutationResolvers = {
  RootMutation: {
    new: (_, { newAlbum }) => albumService.newAlbum(newAlbum),
    delete: (_, { id }) => albumService.deleteAlbum(id),
    update: (_, { id, updates }) => albumService.updateAlbum(id, updates)
  }
};

export const schema = makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    RootQueryType,
    RootMutationType,
    AlbumType,
    AlbumInputType,
    ArtistType,
    GenreType,
    YearType,
    ResponseType
  ],
  resolvers: [queryResolvers, mutationResolvers]
});
