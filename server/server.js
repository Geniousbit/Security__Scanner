const express = require("express");
const app = express();
const dotenv = require("dotenv");
const Auth = require("./Routes/auth");
const Payment = require("./Routes/payment");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const Verify = require("./Routes/verify");
dotenv.config();
const checkSubscription = require("./Controllers/checkSubscription");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },

  (err) => {
    if (err) console.log(err);
    else console.log("mongodb is connected");
  }
);

app.get("/", (req, res) => {
  res.send("Welcome to the new project");
});

app.use("/auth", Auth);
app.use("/payment", Payment);
app.use("/verify", Verify);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Message: ${err.message}`);
  console.log("Server closed due to unhandled promise rejections");

  server.close(() => {
    process.exit(1);
  });
});

cron.schedule("0 0 1 * * *", () => {
  checkSubscription();
});
