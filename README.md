## Installation Instructions

- `npm i`
- `npm run start`
- visit [Altair GraphQL Client for web](https://altair-gql.sirmuel.design/) to access api schema
  - add 'http://localhost:4000/graphql' to the url bar and load docs
  - explore queries or mutations. by hovering over a particular query/mutation you see an `add query` button, use that for quick composing

### Testing Instructions (mostly optimistic tests so far)

- `npm run test`
- (you may need to make sure mocha is intalled globally => `npm i -g mocha`)

### Note: I chose to do this project without overengineering for the task. Best practice for data integrity, performance, and scaling would be to normalize this into 3 tables: artists(id PK, name String), genres(id PK, name String), albums (id PK, name String, artist_id FK, genre_id FK) with unique indexes on artist.name and genre.name and (album.name, album.artist_id). Also I tested mostly optimistic cases and did not do much error handling. GraphQL handles malformed queries and type errors easily and uniformly so those would be easy to parse and handle in the UI.
