const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.llsjgoo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const serviceCollection = client.db('weddingPhotographer').collection('services')
        const reviewCollection = client.db('weddingPhotographer').collection('review')

        app.get('/services', async(req, res) =>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.skip(page*size).limit(size).toArray()
            const count = await serviceCollection.estimatedDocumentCount();
            res.send({count, services})
        })

        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })


        app.post('/services', async(req, res) =>{
            const service =  req.body
            console.log(service)
            const result = await serviceCollection.insertOne(service)
            res.send(result)
        })

        app.get('/reviews', async(req, res) =>{
            const query = {}
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })

        app.post('/reviews', async(req, res) =>{
            const review =  req.body
            console.log(review)
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })


    }
    finally{

    }
}
run().catch(err => console.error(err))

app.get('/', (req, res)=>{
    res.send('App is Running')
})

app.listen(port, () =>{
    console.log(`App running on port: ${port}`)
})