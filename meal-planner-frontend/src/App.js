import React, { useEffect, useState } from 'react';
import './App.css';
import RecipeManager from './components/RecipeManager';
import MealPlan from './components/MealPlan';
import ShoppingList from './components/ShoppingList';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [plan, setPlan] = useState([]);

  // Fetch recipes from backend
  const fetchRecipes = async () => {
    const res = await fetch('http://localhost:4000/api/recipes');
    setRecipes(await res.json());
  };
  useEffect(() => { fetchRecipes(); }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weekly Meal Planner</h1>
      </header>
      <main>
        <section>
          <h2>Meal Plan</h2>
          <MealPlan recipes={recipes} onPlanChange={setPlan} />
        </section>
        <section>
          <h2>Recipes</h2>
          <RecipeManager />
        </section>
        <section>
          <h2>Shopping List</h2>
          <ShoppingList plan={plan} recipes={recipes} />
        </section>
      </main>
    </div>
  );
}

export default App;
