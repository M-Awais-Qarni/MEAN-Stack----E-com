const express = require("express");
const app = express();
const port = 3000;
const categoryRoute = require("./routes/category");
const usersRoute = require("./routes/users");
const productRoute = require("./routes/products");
const cors = require('cors');
const mongoose = require("mongoose");
const environment = require("./env/env")

app.get("/", (req, res) => {
  res.send("Server Running");
});
// Use CORS middleware
const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // If your app needs to handle credentials (cookies, HTTP auth, etc.)
};

app.use(cors(corsOptions));

app.use(express.json()); // For parsing application/json
app.use("/category", categoryRoute);
app.use("/users", usersRoute);
app.use("/products", productRoute);

async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017", {
    dbname: "e-comm-Store",
  });
  console.log("MongoDb Connected");
}
connectDB().catch((err) => {
  console.log(err);
});

app.listen(port, (err) => {
  if (err) {
    console.log("Server Error : ", err);
  } else {
    console.log("Server Running at port : ", port, " +", err);
  }
});
