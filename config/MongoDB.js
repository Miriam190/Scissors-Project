const mongoose = require("mongoose");
require("dotenv").config();

function MongoDB() {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Successfully!");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
 
  });
}

module.exports =  {MongoDB} ;