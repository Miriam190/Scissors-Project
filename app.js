const app = require("./index");
const { MongoDB } = require("./config/MongoDB");
const Cache = require("./config/redis")
const PORT = process.env.PORT || 8000;

MongoDB();
Cache.connect();

app.listen(PORT, () => {
  console.log("Server started listening on,", PORT);
});

