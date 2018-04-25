const express = require('express');
const app = express();
const Web3 = require('web3');

const asyncHandler = fn => {
  return async function(request, response) {
    try {
      const data = await fn(request, response);
      response.json({
        success: true,
        data
      });
    } catch (err) {
      response.json({
        success: false,
        error: err.message
      });
      console.log(err);
    }
  };
};

app.get(
  '/api',
  asyncHandler(async (request, response) => {
    console.log('api works');
  })
);

app.get(
  '/api/games',
  asyncHandler(async (request, response) => {
    console.log('api works');
  })
);

app.listen(8080);
