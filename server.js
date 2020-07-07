"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const { doubleCheck } = require("./data/verification");

const handleForm = (req, res) => {
  const { address, email, surname, givenName, country, order, size } = req.body;
  const validCountry = doubleCheck.checkCountry(country);
  const invalidAddress = doubleCheck.checkAddress(address);
  const invalidName = doubleCheck.checkName(givenName, surname);
  const invalidEmail = doubleCheck.checkEmail(email);
  const isInStock = doubleCheck.checkStock(order, size);
  if (!validCountry) {
    res.json({ status: "error", error: "undeliverable" });
  } else if (invalidAddress || invalidEmail || invalidName) {
    res.json({ status: "error", error: "repeat-customer" });
  } else if (isInStock === false) {
    res.json({ status: "error", error: "unavailable" });
  } else {
    res.json({ status: "success" });
  }
};

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .post("/order", handleForm)
  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(8000, () => console.log(`Listening on port 8000`));
