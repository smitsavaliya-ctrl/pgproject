const { MongoClient } = require("mongodb");

const uri = "mongodb://smitsavaliya22072024_db_user:Smit123@ac-iy3odk9-shard-00-00.raao9qb.mongodb.net:27017,ac-iy3odk9-shard-00-01.raao9qb.mongodb.net:27017,ac-iy3odk9-shard-00-02.raao9qb.mongodb.net:27017/?ssl=true&replicaSet=atlas-6lhvwr-shard-0&authSource=admin&appName=Cluster0";

const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Success! Connected to MongoDB Atlas!");

    // 1. FIXED: Capital 'S' in Staynest_db!
    const database = client.db("Staynest_db");
    const collection = database.collection("listings");

    // 2. Fetch the document you just inserted
    const myData = await collection.findOne({});

    // 3. Print out the cities to prove it worked!
    console.log("-----------------------------------------");
    console.log("Successfully fetched data from the cloud!");
    console.log("Here are my cities:", myData.cities);
    console.log("Total properties found:", myData.properties.length);
    console.log("-----------------------------------------");

  } catch (err) {
    console.error("Oops, there was an error:", err);
  } finally {
    // Close the connection when we are done testing
    await client.close();
  }
}
connectDB();