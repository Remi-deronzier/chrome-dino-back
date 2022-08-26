const express = require("express");
const router = express.Router();

const Result = require("../models/Result");

const maxResultsToDisplay = 10;

router.post("/scores/sort", async (req, res) => {
  console.log("route: /scores/sort");
  console.log("body: ", req.fields);
  try {
    const { score, username } = req.fields;
    const sortFilter = { score: -1 };
    const results = await Result.find().sort(sortFilter);
    const lastIndex = results.length - 1;
    let rank = -1; // -1 means not in top 10
    const newResult = Result({
      username,
      score,
    });
    if (results.length < maxResultsToDisplay) {
      await newResult.save();
      results.unshift(newResult);
      results.sort(compareResults);
      rank = results.findIndex((result) => result.score === score) + 1;
    } else {
      if (score > results[lastIndex].score) {
        const resultToUpdateId = results[lastIndex]._id;
        results.pop();
        results.push(newResult);
        results.sort(compareResults);
        await Result.findByIdAndDelete(resultToUpdateId, newResult);
        await newResult.save();
        rank = results.findIndex((result) => result.score === score) + 1;
      }
    }
    res.status(200).json({ results, rank });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/scores/all", async (req, res) => {
  console.log("route: /scores/all");
  try {
    const sortFilter = { score: -1 };
    const results = await Result.find().sort(sortFilter);
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

router.get("/scores/is-in-top-10", async (req, res) => {
  console.log("route: /scores/is-in-top-10");
  console.log("query: ", req.query);
  try {
    const { score } = req.query;
    const sortFilter = { score: -1 };
    const results = await Result.find().sort(sortFilter);
    if (results.length < maxResultsToDisplay) {
      res.status(200).json({ isInTop10: true });
    } else {
      if (score > results[results.length - 1].score) {
        res.status(200).json({ isInTop10: true });
      } else {
        res.status(200).json({ isInTop10: false });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
