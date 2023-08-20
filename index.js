const express = require("express");
const cors = require("cors");
const app = express();
const port = 3002;

require("dotenv").config();

//middleware :
app.use(cors());
app.use(express.json());

// app.use(cors);
app.use(express.json());
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f8emp.mongodb.net/?retryWrites=true&w=majority`;

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

    const menuCollection = client.db("Bistro-Boss").collection("Menu");
    const reviewCollection = client.db("Bistro-Boss").collection("Reviews");
    const CartCollection = client.db("Bistro-Boss").collection("carts");


    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result)
    });

    app.get("/reviews", async (req, res) => {
      const reviews = await reviewCollection.find().toArray();
      res.send(reviews);
    })

    //cart collection POST
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
   
      if (!email) {
        res.send([])
      } else {
        const query = { email: email };
        const result = await CartCollection.find(query).toArray();
        res.send(result);
      }

    })
    app.post("/carts", async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await CartCollection.insertOne(item);
      res.send(result);
    })
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

//routes:
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(` http://localhost:${port}`);
});
