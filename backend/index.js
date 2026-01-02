
// --- Imports ---
import express from 'express';
import pg from 'pg';
import cors from 'cors';

// --- App Initialization ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- PostgreSQL Connection ---
const pool = new pg.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: { rejectUnauthorized: false }
});

// --- API Endpoints ---
// Projects
app.get('/api/projects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.post('/api/projects', async (req, res) => {
    const { projectNumber, title, department, client, phases, pricing, tasks, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO projects (project_number, title, department, client, phases, pricing, tasks, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
            [projectNumber, title, department, client, JSON.stringify(phases), JSON.stringify(pricing), JSON.stringify(tasks), status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { projectNumber, title, department, client, phases, pricing, tasks, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE projects SET project_number = $1, title = $2, department = $3, client = $4, phases = $5, pricing = $6, tasks = $7, status = $8 WHERE id = $9 RETURNING *',
            [projectNumber, title, department, client, JSON.stringify(phases), JSON.stringify(pricing), JSON.stringify(tasks), status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM projects WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Proposals
app.get('/api/proposals', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM proposals ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching proposals:', err);
        res.status(500).json({ error: 'Failed to fetch proposals' });
    }
});

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

app.put('/api/proposals/:id', async (req, res) => {
    const { id } = req.params;
    const { title, department, client, createdBy, qaStatus, phases, pricing, tasks, comments } = req.body;
    try {
        const result = await pool.query(
            'UPDATE proposals SET title = $1, department = $2, client = $3, created_by = $4, qa_status = $5, phases = $6, pricing = $7, tasks = $8, comments = $9 WHERE id = $10 RETURNING *',
            [title, department, client, createdBy, qaStatus, JSON.stringify(phases), JSON.stringify(pricing), JSON.stringify(tasks), comments, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating proposal:', err);
        res.status(500).json({ error: 'Failed to update proposal' });
    }
});

app.delete('/api/proposals/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM proposals WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting proposal:', err);
        res.status(500).json({ error: 'Failed to delete proposal' });
    }
});

app.patch('/api/proposals/:id/qa', async (req, res) => {
    const { id } = req.params;
    const { qaStatus } = req.body;
    try {
        await pool.query('UPDATE proposals SET qa_status = $1 WHERE id = $2', [qaStatus, id]);
        if (qaStatus === 'QA Completed') {
            const propRes = await pool.query('SELECT * FROM proposals WHERE id = $1', [id]);
            const proposal = propRes.rows[0];
            if (proposal) {
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

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend server is healthy' });
});

// Test route
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// DB connection check
pool.connect()
    .then(client => {
        console.log('Connected to PostgreSQL database');
        client.release();
    })
    .catch(err => {
        console.error('Failed to connect to PostgreSQL database:', err);
        process.exit(1);
    });

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
