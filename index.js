const express = require("express")
const { MongoClient } = require("mongodb")
require("dotenv").config()
const cors = require("cors")
const ObjectId = require("mongodb").ObjectId

const app = express()
const port = process.env.PORT || 5000

// Middlewere
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.woosd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

// console.log(uri)
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

async function run() {
  try {
    await client.connect()
    const database = client.db("carmechanic")
    const servicesCollection = database.collection("services")

    // ---------Get Api or Multiple Service--------//
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({})
      const services = await cursor.toArray()
      res.send(services)
    })

    // --------- Get Api or Single Service -------//
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id
      console.log("getting specific service", id)
      const query = { _id: ObjectId(id) }
      const service = await servicesCollection.findOne(query)
      res.json(service)
    })

    //-------- Post Api---------//
    app.post("/services", async (req, res) => {
      const service = req.body
      console.log("hit the post", service)
      const result = await servicesCollection.insertOne(service)
      console.log(result)
      res.json(result)
    })

    // ------- Delete api-------//
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await servicesCollection.deleteOne(query)
      res.json(result)
    })
  } finally {
    // await client.close()
  }
}

run().catch(console.dir)

app.get("/", (req, res) => {
  res.send("Running Genius Car Mechanic Server")
})

app.get("/hello", (req, res) => {
  res.send("hello updated here")
})

app.listen(port, () => {
  console.log("Runnig Genius On Port", port)
})

// -----One Time----//
// create a heroku account
// globally install heroku cli

// ----- In every project-----//
//  git init
// .git ignore(node_modules, .env)
// push everything to git
//  make sure you have ("start" : "node index.js") script in package.json
// make sure to put process.env.PORT in front of port number
// herolu login
// herouko git push main
//

//  after upadteing // // // // /
// git add.,  git commit -m"", git push
// git push heroku main
