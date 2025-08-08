import React from 'react';

function ShoppingList({ plan, recipes }) {
  // Flatten all selected recipe IDs
  const selectedIds = plan.flat().filter(Boolean);
  // Get all recipes for selected IDs
  const selectedRecipes = recipes.filter(r => selectedIds.includes(r.id.toString()) || selectedIds.includes(r.id));
  // Aggregate ingredients
  const allIngredients = selectedRecipes.flatMap(r => r.ingredients.split(',').map(i => i.trim()));
  const uniqueIngredients = Array.from(new Set(allIngredients));

  const handleCopy = () => {
    const text = 'Shopping List for the Week:\n' + uniqueIngredients.map(i => '- ' + i).join('\n');
    navigator.clipboard.writeText(text);
    alert('Shopping list copied!');
  };

  return (
    <div>
      <h3>Shopping List</h3>
      <ul>
        {uniqueIngredients.map(i => <li key={i}>{i}</li>)}
      </ul>
      <button onClick={handleCopy}>Copy to WhatsApp</button>
    </div>
  );
}

export default ShoppingList;