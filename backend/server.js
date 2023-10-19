const { Pool } = require('pg');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
require('dotenv').config();

// Use CORS middleware before your routes
app.use(cors());

const pool = new Pool({
    user: 'aklrdxqgeciqyw',
    host: 'ec2-107-21-67-46.compute-1.amazonaws.com',
    database: 'd2c8h9gginll7q',
    password: 'a8914d0696f40c7e49d1b2606b34759a79a33c1d97a83fe22ce806d142ba92f7',
    port: 5432,
    // Only include SSL if needed, e.g. for Heroku or a platform that requires it.
    ssl: {
        rejectUnauthorized: false
    }
});

// READ or GET AGENTS FROM THE DB
app.get('/agents', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM agent_table');  // Assuming the table name is 'agents'
        const results = { 'results': (result) ? result.rows : null };
        res.json(results);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

// CREATE A NEW AGENT INTO THE DB
app.post('/agents', async (req, res) => {
    try {
        const { agent_name, contract_level, upline } = req.body;
        const result = await pool.query('INSERT INTO agent_table (agent_name, contract_level, upline) VALUES ($1, $2, $3) RETURNING *', [agent_name, contract_level, upline]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(400).send("Error " + err);
    }
});

// UPDATE AN EXISTING AGENT IN THE DB
app.put('/agents/:agent_code', async (req, res) => {
    try {
        const { agent_name, contract_level, upline } = req.body;
        const { agent_code } = req.params;
        const result = await pool.query('UPDATE agent_table SET agent_name=$1, contract_level=$2, upline=$3 WHERE agent_code=$4 RETURNING *', [agent_name, contract_level, upline, agent_code]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(400).send("Error " + err);
    }
});

// DELETE AN AGENT FROM THE DB
app.delete('/agents/:agent_code', async (req, res) => {
    try {
        const { agent_code } = req.params;
        await pool.query('DELETE FROM agent_table WHERE agent_code=$1', [agent_code]);
        res.json({ message: "Agent deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).send("Error " + err);
    }
});

// GET A SINGLE AGENT
app.get('/agents/:agent_code', async (req, res) => {
    try {
        const { agent_code } = req.params;
        const result = await pool.query('SELECT * FROM agent_table WHERE agent_code=$1', [agent_code]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
