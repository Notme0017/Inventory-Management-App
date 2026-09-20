require("dotenv").config();
const express = require("express");
const path = require("node:path");
const {error} = require("node:console");
const operationsRouter = require("./routes/operationsRouter");

const app = express();

const assetPath = path.join(__dirname, "public");
app.use(express.static(assetPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

app.use('/', operationsRouter);

app.use((req, res) =>{
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) =>{
  console.error(err);
  res.status(err.statusCode||500).send(err.message || "something went wrong");
});

const PORT = 8080;
app.listen(PORT, (error) =>{
  if(error) throw error;
  console.log(`Express is running at port: ${PORT}`);
})