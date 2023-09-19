const express = require("express");
const homeRouter = require("./home.route.js");
const filesRouter = require("./files.route");

function routerAPI(app) {
  const router = express.Router();

  app.use("/", homeRouter);
  app.use("/api/v1/", router);
  router.use("/files", filesRouter);
  /* router.use("/auth", require("./auth.route"));
  router.use("/users", require("./users.route")); */
}

module.exports = routerAPI;
