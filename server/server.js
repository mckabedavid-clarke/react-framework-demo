const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/todos', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM todos ORDER BY created_at DESC');
  res.json(rows);
});

app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  const [result] = await db.query('INSERT INTO todos (title) VALUES (?)', [title]);
  res.json({ id: result.insertId, title, completed: false });
});

app.put('/api/todos/:id', async (req, res) => {
  const { completed } = req.body;
  await db.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, req.params.id]);
  res.json({ success: true });
});

app.delete('/api/todos/:id', async (req, res) => {
  await db.query('DELETE FROM todos WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
