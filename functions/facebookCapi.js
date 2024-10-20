const functions = require("firebase-functions");
const express = require("express"); // Import express
const cors = require("cors"); // Import cors
const sendEventToFacebook = require("./actions/sendEventToFacebook");

const app = express(); // Initialize express app

// Configure CORS middleware
app.use(cors({ origin: true }));

app.use(express.json()); // Parse JSON request bodies

app.post("/", async (req, res) => {
  try {
    // Get the IP address from the request
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    console.log(req.body);

    // Send event to Facebook using the request body and IP address
    const response = await sendEventToFacebook(req.body, ipAddress);

    // Respond with success status and message
    res.status(200).send({
      success: true,
      message: response,
    });
  } catch (error) {
    console.error("Error processing Facebook CAPI request", error);

    // Respond with an error status and message
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Export the function to handle HTTP requests
exports.facebookCapi = functions.https.onRequest(app);
