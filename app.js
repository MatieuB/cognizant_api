import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { ApolloServer } from "apollo-server-express";

import { schema } from "./src/graphql/schema";
import { initDB } from "./src/db/db";

initDB();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./public")));

const server = new ApolloServer({ schema });
server.applyMiddleware({ app });

// catch 404 and forward to error handler
app.use(function({ body }, res, next) {
  console.log("req", body);
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log("err", err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: "error" });
});

app.listen(4000, () => {
  // app.emit("appStarted");
  console.log("Running a GraphQL API server at localhost:4000/graphql");
});

export default app;
