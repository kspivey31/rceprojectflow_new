// Entry point for the backend Express server
// This file will set up the Express app and connect to PostgreSQL
// Impact: This is the main file that starts your backend server

import express from 'express';
import pg from 'pg';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());
// Enable CORS for frontend-backend communication
app.use(cors());

// PostgreSQL connection setup
// Impact: This connects your backend to your AWS RDS PostgreSQL database
const pool = new pg.Pool({
    user: 'rce301', // TODO: Replace with your DB user
    host: 'rce-database.cz4im8ikc9n0.us-east-2.rds.amazonaws.com', // TODO: Replace with your DB host (RDS endpoint)
    database: 'rceprojectflow_new', // TODO: Replace with your DB name
    password: 'RCE1991#', // TODO: Replace with your DB password
    port: 5432, // Default PostgreSQL port
});


// --- Proposals API Endpoints ---

// GET all proposals
// Impact: Returns a list of all proposals from the database
app.get('/api/proposals', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM proposals ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching proposals:', err);
        res.status(500).json({ error: 'Failed to fetch proposals' });
    }
});

// POST create a new proposal
// Impact: Adds a new proposal to the database
app.post('/api/proposals', async (req, res) => {
    const { title, department, client, createdBy, qaStatus, phases, pricing, tasks, comments } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO proposals (title, department, client, created_by, qa_status, phases, pricing, tasks, comments) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
            [title, department, client, createdBy, qaStatus, JSON.stringify(phases), JSON.stringify(pricing), JSON.stringify(tasks), comments]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating proposal:', err);
        res.status(500).json({ error: 'Failed to create proposal' });
    }
});

// PATCH update QA status for a proposal
// Impact: Updates the QA status and triggers project creation if QA Completed
app.patch('/api/proposals/:id/qa', async (req, res) => {
    const { id } = req.params;
    const { qaStatus } = req.body;
    try {
        // Update QA status
        await pool.query('UPDATE proposals SET qa_status = $1 WHERE id = $2', [qaStatus, id]);

        // If QA Completed, create a new project from this proposal (simplified logic)
        if (qaStatus === 'QA Completed') {
            // Fetch proposal data
            const propRes = await pool.query('SELECT * FROM proposals WHERE id = $1', [id]);
            const proposal = propRes.rows[0];
            if (proposal) {
                // Insert new project using proposal data
                await pool.query(
                    'INSERT INTO projects (title, department, client, phases, pricing, tasks, status) VALUES ($1,$2,$3,$4,$5,$6,$7)',
                    [proposal.title, proposal.department, proposal.client, proposal.phases, proposal.pricing, proposal.tasks, 'Active']
                );
            }
        }
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating QA status:', err);
        res.status(500).json({ error: 'Failed to update QA status' });
    }
});

// --- End Proposals API ---

// Test route
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
