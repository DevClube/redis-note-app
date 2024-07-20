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

// Endpoint to get all notes
app.get('/notes', async (req, res) => {
    try {
        const notes = await client.lRange('notes', 0, -1);
        res.send(notes.map(note => JSON.parse(note)));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Endpoint to add a new note with an auto-incremented ID
app.post('/notes', async (req, res) => {
    const note = req.body;
    try {
        // Increment the note ID counter
        const newId = await client.incr('note_id_counter');
        // Assign the new ID to the note
        note.id = newId;
        // Push the note to the Redis list
        await client.rPush('notes', JSON.stringify(note));
        res.send({ status: 'success', id: note.id });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Endpoint to delete a note by ID
app.delete('/notes/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const notes = await client.lRange('notes', 0, -1);
        const noteToDelete = notes.find(note => JSON.parse(note).id === id);

        if (!noteToDelete) {
            return res.status(404).send({ error: 'Note not found' });
        }

        // Remove the note by its content
        await client.lRem('notes', 1, noteToDelete);

        res.send({ status: 'success' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
