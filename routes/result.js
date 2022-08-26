const express = require("express");
const router = express.Router();

const Result = require("../models/Result");

const maxResultToDisplay = 10;

router.post("/scores/sort", async (req, res) => {
  console.log("route: /scores/sort");
  console.log("body: ", req.fields);
  try {
    const { score, username } = req.fields;
    const sortFilter = { score: -1 };
    const results = await Result.find().sort(sortFilter);
    const lastIndex = results.length - 1;
    const newResult = Result({
      username,
      score,
    });
    if (results.length < maxResultToDisplay) {
      await newResult.save();
      results.unshift(newResult);
      results.sort(compareResults);
    } else {
      if (score > results[lastIndex].score) {
        const resultToUpdateId = results[lastIndex]._id;
        results.pop();
        results.push(newResult);
        results.sort(compareResults);
        await Result.findByIdAndDelete(resultToUpdateId, newResult);
        await newResult.save();
      }
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

function compareResults(result1, result2) {
  if (result1.score < result2.score) {
    return 1;
  }
  if (result2.score < result1.score) {
    return -1;
  }
  return 0;
}

module.exports = router;
