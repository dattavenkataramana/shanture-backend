const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database('database.db')

db.serialize(() => {
  db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, completed BOOLEAN)");
});

app.get('/api/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/tasks', (req, res) => {
  const { description } = req.body;
  db.run("INSERT INTO tasks (description, completed) VALUES (?, ?)", [description, false], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ id: this.lastID, description, completed: false });
    }
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", [id], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.sendStatus(204);
    }
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.run("UPDATE tasks SET completed = ? WHERE id = ?", [completed, id], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ id, completed });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
