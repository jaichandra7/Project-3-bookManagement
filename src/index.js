const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");

const route = require("./route/route.js");
const app = express();

app.use(bodyParser.json()); // tells the system that you want json to be used
// app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true })); 

// mongoDb connection
mongoose
  .connect(
    "mongodb+srv://jaichandra:9908078754b@cluster0.pwobr.mongodb.net/project-3",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));

// Initial route
app.use("/", route);

// port
app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
