const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const databaseRoutes = require("./routes/databaseRoutes");
const { readConfig } = require("./utils/configReader");

const config = readConfig();
const app = express();
const PORT = config.port || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", databaseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
