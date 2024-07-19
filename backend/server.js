import bodyParser from "body-parser";

import express from "express";

import cors from "cors";

import redis from "redis";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const client = redis.createClient();

client.on('error', (err) => {
    console.error('Redis error:', err);
});

// Connect to Redis
client.connect();

app.get('/notes', async (req, res) => {
    try {
        const notes = await client.lRange('notes', 0, -1);
        res.send(notes.map(note => JSON.parse(note)));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/notes', async (req, res) => {
    const note = req.body;
    try {
        await client.rPush('notes', JSON.stringify(note));
        res.send({ status: 'success' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});