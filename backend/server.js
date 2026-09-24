const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = 5000; // The port your backend will live on

// These tools allow your frontend to communicate with this backend
app.use(cors());
app.use(express.json());

// Your exact MongoDB connection string
const uri = "mongodb://smitsavaliya22072024_db_user:Smit123@ac-iy3odk9-shard-00-00.raao9qb.mongodb.net:27017,ac-iy3odk9-shard-00-01.raao9qb.mongodb.net:27017,ac-iy3odk9-shard-00-02.raao9qb.mongodb.net:27017/?ssl=true&replicaSet=atlas-6lhvwr-shard-0&authSource=admin&appName=Cluster0";
const client = new MongoClient(uri);

// --- THIS IS YOUR API ROUTE ---
// When the frontend visits "/api/properties", this code runs
app.get("/api/properties", async (req, res) => {
  try {
    const database = client.db("Staynest_db");
    const collection = database.collection("listings");
    
    // Fetch the data from the cloud
    const myData = await collection.findOne({});
    
    // Send it to the frontend as a JSON response!
    res.json(myData);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// --- START THE SERVER ---
async function startServer() {
  try {
    await client.connect();
    console.log("Success! Connected to MongoDB Atlas!");
    
    // Tell the server to start listening
    app.listen(port, () => {
      console.log(`Backend API is running at http://localhost:${port}`);
      console.log(`Test your API here: http://localhost:${port}/api/properties`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();