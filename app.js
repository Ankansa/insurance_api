const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const cors = require("cors");
const path = require("path");
dotenv.config();
console.log("================================================")
var indexRouter = require("./API/routes/index");


const port = process.env.PORT;
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

app.use(compression());

app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
);

app.use(cors());

app.use("/api", indexRouter);
// app.use("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "./index.html"));
// });

app.use(express.static(path.join(__dirname, "public", "static")));
app.use(express.static(path.join(__dirname, "./dist/browser")));

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/browser/index.html"));
});



let args = process.argv.slice(2);


let db_url = process.env.INSURANCE_DB;


let opts = {
    // useNewUrlParser: true,
    // keepAlive: true,
    // bufferMaxEntries: 0,
    connectTimeoutMS: 45000,
    socketTimeoutMS: 60000,
    family: 4,
    // useUnifiedTopology: true,
  };
  mongoose
    .connect(db_url, opts)
    .then(() => {
      console.log("connected to port =>", port);
      console.log(`http://localhost:${port}`);
      console.log("connected to db =>", db_url);
      // console.log(
      //   `=============================== ${
      //     args && args[0] ? args[0] : "stage"
      //   } Server is running ==================================`
      // );
    })
    .catch((err) => {
      console.log("🚀 ~ file: index.js:35 ~ mongoose.connect ~ err", err);
      return {};
    });
  
  app.listen(port, () => {
    console.log(`server is start port number ${port}`);
  });