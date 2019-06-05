require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = async function(event) {
  console.log(event);
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 200,
      headers,
      body: "Not a post request"
    };
  }

  const data = JSON.parse(event.body);

  if (!data.token || parseInt(data.amount) < 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing required fields"
      })
    };
  }

  stripe.charges
    .create({
      amount: parseInt(data.amount * 100),
      currency: "usd",
      description: "Your team",
      source: data.token
    })
    .then(({ status }) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ status })
      };
    })
    .catch(error => {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Error: ${error.message}`
        })
      };
    });
};
