import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Weekly Meal Planner</h1>
      </header>
      <main>
        <section>
          <h2>Meal Plan</h2>
          {/* MealPlan component will go here */}
          <div>Meal plan UI placeholder</div>
        </section>
        <section>
          <h2>Recipes</h2>
          {/* RecipeManager component will go here */}
          <div>Recipe management UI placeholder</div>
        </section>
        <section>
          <h2>Shopping List</h2>
          {/* ShoppingList component will go here */}
          <div>Shopping list UI placeholder</div>
        </section>
      </main>
    </div>
  );
}

export default App;
