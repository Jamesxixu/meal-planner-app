import React, { useEffect, useState } from 'react';

function RecipeManager() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({ name: '', ingredients: '', instructions: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchRecipes = async () => {
    const res = await fetch('http://localhost:4000/api/recipes');
    setRecipes(await res.json());
  };

  useEffect(() => { fetchRecipes(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await fetch(`http://localhost:4000/api/recipes/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('http://localhost:4000/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: '', ingredients: '', instructions: '' });
    setEditingId(null);
    fetchRecipes();
  };

  const handleEdit = recipe => {
    setForm({ name: recipe.name, ingredients: recipe.ingredients, instructions: recipe.instructions });
    setEditingId(recipe.id);
  };

  const handleDelete = async id => {
    await fetch(`http://localhost:4000/api/recipes/${id}`, { method: 'DELETE' });
    fetchRecipes();
  };

  return (
    <div>
      <h3>All Recipes</h3>
      <ul>
        {recipes.map(r => (
          <li key={r.id}>
            <b>{r.name}</b> <br/>
            <small>Ingredients:</small> {r.ingredients} <br/>
            <small>Instructions:</small> {r.instructions} <br/>
            {r.is_fixed ? <span>(Fixed)</span> : (
              <>
                <button onClick={() => handleEdit(r)}>Edit</button>
                <button onClick={() => handleDelete(r.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <h3>{editingId ? 'Edit Recipe' : 'Add Recipe'}</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="Ingredients (comma separated)" required />
        <textarea name="instructions" value={form.instructions} onChange={handleChange} placeholder="Instructions" required />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', ingredients: '', instructions: '' }); }}>Cancel</button>}
      </form>
    </div>
  );
}

export default RecipeManager;