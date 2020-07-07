"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const { doubleCheck } = require("./data/verification");

const handleForm = (req, res) => {
  const {
    address,
    email,
    surname,
    givenName,
    country,
    order,
    size,
    city,
    province,
    postCode,
  } = req.body;
  const mainEntries = [
    address,
    email,
    surname,
    givenName,
    country,
    order,
    city,
    province,
    postCode,
  ];
  const invalidEntry = mainEntries.includes("undefined");
  const validCountry = doubleCheck.checkCountry(country);
  const invalidAddress = doubleCheck.checkAddress(address);
  const invalidName = doubleCheck.checkName(givenName, surname);
  const invalidEmail = doubleCheck.checkEmail(email);
  const isInStock = doubleCheck.checkStock(order, size);
  const sizeNotChecked = doubleCheck.checkSize(order, size);
  console.log(size);
  if (invalidEntry) {
    res.json({ status: "error", error: "missing-data" });
  } else if (sizeNotChecked) {
    res.json({ status: "error", error: "missing-data" });
  } else if (!validCountry) {
    res.json({ status: "error", error: "undeliverable" });
  } else if (invalidAddress || invalidEmail || invalidName) {
    res.json({ status: "error", error: "repeat-customer" });
  } else if (isInStock === false) {
    res.json({ status: "error", error: "unavailable" });
  } else {
    res.json({ status: "success" });
  }
};
const formSent = (req, res) => {
  res.render("/pages/order-confirmation");
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
  // .get("/order-confirmed", formSent)
  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(8000, () => console.log(`Listening on port 8000`));
