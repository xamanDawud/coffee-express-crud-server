const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lgiglma.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    let database = client.db("coffee_express").collection("users");

    app.get("/coffees", async (req, res) => {
      let result = await database.find().toArray();
      res.send(result);
    });

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await database.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.post("/coffees", async (req, res) => {
      let coffee = req.body;
      let result = await database.insertOne(coffee);
      res.send(result);
      console.log(result);
    });

    app.put("/coffee/:id", async (req, res) => {
      let id = req.params.id;
      let coffee = req.body;
      console.log(coffee);
      let option = { upsert: true };
      let cursor = { _id: new ObjectId(id) };
      let updatedCoffee = {
        $set: {
          name: coffee.name,
          chef: coffee.chef,
          supplier: coffee.supplier,
          taste: coffee.taste,
          category: coffee.category,
          details: coffee.details,
          photo: coffee.photo,
        },
      };
      let result = await database.updateOne(cursor, updatedCoffee, option);

      console.log(result);
      res.send(result);
    });

    app.delete("/coffees/:id", async (req, res) => {
      let id = req.params.id;
      let cursor = { _id: new ObjectId(id) };
      let result = await database.deleteOne(cursor);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
