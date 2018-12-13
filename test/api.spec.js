import request from "supertest";
import { expect } from "chai";

import app from "../app";

const agent = request.agent(app);
const graphqlUrl = "/graphql";

describe("QUERY all", () => {
  before(function(done) {
    app.on("appStarted", function() {
      console.log("appStarted");
      done();
    });
  });

  it("should 103 seed albums", () => {
    const fields = `{ album artist genre year id }`;
    return agent
      .post(graphqlUrl)
      .send({
        query: `query { all ${fields} }`
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.all.length).to.equal(103);
      });
  });
});
