const Message = require("./models/Message");
const SadWord = require("./models/SadWords");
const Responding = require("./models/Responding");
const express = require("express");
const cors = require("cors");
const db = require("./database/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routes/botRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

exports.connectDB = () => {
  db.authenticate()
    .then(() => {
      console.log("logged in to database");
      Message.init(db);
      SadWord.init(db);
      Responding.init(db);
      //create tables if not existed
      Message.sync();
      SadWord.sync();
      Responding.sync();
    })
    .catch((err) => console.log(err));
};
