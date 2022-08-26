const mongoose = require("mongoose");

const Result = mongoose.model("Result", {
  username: {
    type: String,
    maxLength: 50,
    required: true,
  },
  score: {
    type: Number,
  },
});

module.exports = Result;
