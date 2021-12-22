const express = require("express");
const cors = require("cors");
require("dotenv").config();
const os = require("os");
const { createServer } = require("http");
const sticky_cluster = require("sticky-cluster");
// importing routes
const userRoute = require("./routes/userRoute");
const propertyRoute = require("./routes/propertyRoute");
const reservationRoute = require("./routes/reservationRoute");
const applicationRoute = require("./routes/applicationRoute");
const tokenController = require("./controller/tokenController");
const revenueRoute = require("./routes/revenueRoute");

// express app
const app = express();

//midlleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//update token and refreshToken
// to be replaced
app.use(tokenController);

app.get("/", (req, res) => {
  res.send("Rent A Property API");
});
//user routes
app.use("/user", userRoute);
//authenticate token
//app.use(jwtFunction.authenticateToken);
//revenue routes
app.use("/revenue", revenueRoute);
//property routes
app.use("/property", propertyRoute);
//reservation routes
app.use("/reservation", reservationRoute);
//application routes
app.use("/application", applicationRoute);

const PORT = process.env.PORT || 5000;
const server = createServer(app);
if (process.env.NODE_ENV == "development") {
  console.log("worked !");
  const HOST = "0.0.0.0";
  server.listen(PORT, HOST, () => {
    console.log(
      `[PID:${process.pid}]Server running on http://${HOST}:${PORT} !`
    );
  });
} else {
  console.log(PORT);
  sticky_cluster((callback) => callback(server), {
    concurrency: os.cpus().length,
    port: PORT,
  });
}
