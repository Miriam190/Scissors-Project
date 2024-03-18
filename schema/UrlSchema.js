const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const URLSchema = new mongoose.Schema({
  id: ObjectId,
  urlId: {
    type: String,
  },
  origUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
  },
  historyUrl: {
    type: String,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  User: {
    type: String,
    ref: "User",
  },
  clicker: {
    type: Array,
    default: "none" ,
  },
  createdAt: {
    type: String,
  },
});

module.exports = mongoose.model("URL", URLSchema);
