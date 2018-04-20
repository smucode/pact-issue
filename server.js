const express = require("express");
const app = express();

app.get("*", (req, res) => {
  console.log(req.method + ": " + req.url);
  setInterval(() => res.json({ foo: "bar" }), 35000);
});

app.post("*", (req, res) => {
  console.log(req.method + ": " + req.url);
  res.json({ foo: "bar" });
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
