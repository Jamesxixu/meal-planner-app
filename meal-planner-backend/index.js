const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// SQLite DB setup
const dbPath = path.resolve(__dirname, 'mealplanner.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    is_fixed INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    meal_type TEXT NOT NULL,
    recipe_id INTEGER,
    FOREIGN KEY(recipe_id) REFERENCES recipes(id)
  )`);

  // Insert some fixed recipes if not present
  db.all('SELECT COUNT(*) as count FROM recipes WHERE is_fixed = 1', (err, rows) => {
    if (rows[0].count === 0) {
      const fixedRecipes = [
        {
          name: 'Omelette',
          ingredients: 'Eggs, Milk, Salt, Pepper, Butter',
          instructions: 'Beat eggs with milk, salt, and pepper. Cook in buttered pan until set.',
        },
        {
          name: 'Chicken Salad',
          ingredients: 'Chicken breast, Lettuce, Tomato, Cucumber, Olive oil, Lemon juice, Salt, Pepper',
          instructions: 'Grill chicken, chop veggies, mix all with olive oil and lemon juice.',
        },
        {
          name: 'Pasta Marinara',
          ingredients: 'Pasta, Tomato sauce, Garlic, Olive oil, Basil, Salt, Parmesan',
          instructions: 'Cook pasta, heat sauce with garlic and olive oil, combine and top with basil and parmesan.',
        },
      ];
      const stmt = db.prepare('INSERT INTO recipes (name, ingredients, instructions, is_fixed) VALUES (?, ?, ?, 1)');
      fixedRecipes.forEach(r => stmt.run(r.name, r.ingredients, r.instructions));
      stmt.finalize();
    }
  });
});

// API Endpoints
app.get('/api/recipes', (req, res) => {
  db.all('SELECT * FROM recipes', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/recipes', (req, res) => {
  const { name, ingredients, instructions } = req.body;
  db.run('INSERT INTO recipes (name, ingredients, instructions) VALUES (?, ?, ?)', [name, ingredients, instructions], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.put('/api/recipes/:id', (req, res) => {
  const { name, ingredients, instructions } = req.body;
  db.run('UPDATE recipes SET name = ?, ingredients = ?, instructions = ? WHERE id = ? AND is_fixed = 0', [name, ingredients, instructions, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

app.delete('/api/recipes/:id', (req, res) => {
  db.run('DELETE FROM recipes WHERE id = ? AND is_fixed = 0', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Meals endpoints (for weekly plan)
app.get('/api/meals', (req, res) => {
  db.all('SELECT * FROM meals', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/meals', (req, res) => {
  const { day, meal_type, recipe_id } = req.body;
  db.run('INSERT INTO meals (day, meal_type, recipe_id) VALUES (?, ?, ?)', [day, meal_type, recipe_id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.delete('/api/meals', (req, res) => {
  db.run('DELETE FROM meals', function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Meal Planner backend running on port ${PORT}`);
});