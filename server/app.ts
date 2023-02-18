import * as dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
import express from "express";
const app = express();
const port = process.env.PORT || 9000;

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get("/", (req, res) => {});

app.get("/status", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/find-food", (req, res) => {
  const latitude = req.query.lat;
  const longitude = req.query.lon;

  if (!latitude || !longitude) {
    return res.status(400).send("No location provided :(");
  }

  const searchTerm = "restaurants";
  const radius = 1609; // ~1 mile in meters
  const queryParams = `term=${searchTerm}&sort_by=rating&latitude=${latitude}&longitude=${longitude}&radius=${radius}&open_now=true`;
  return fetch(`https://api.yelp.com/v3/businesses/search?${queryParams}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      accept: "application/json",
    },
  }).then((response) => res.send(response));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
