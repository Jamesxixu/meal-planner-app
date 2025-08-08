import React, { useEffect, useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

function MealPlan({ recipes, onPlanChange }) {
  const [plan, setPlan] = useState(() => days.map(day => mealTypes.map(() => null)));

  useEffect(() => {
    if (onPlanChange) onPlanChange(plan);
  }, [plan, onPlanChange]);

  const handleSelect = (dayIdx, mealIdx, recipeId) => {
    const newPlan = plan.map((meals, d) =>
      meals.map((r, m) => (d === dayIdx && m === mealIdx ? recipeId : r))
    );
    setPlan(newPlan);
  };

  const handleRandomize = () => {
    const newPlan = days.map(() => mealTypes.map(() => {
      if (recipes.length === 0) return null;
      return recipes[Math.floor(Math.random() * recipes.length)].id;
    }));
    setPlan(newPlan);
  };

  return (
    <div>
      <button onClick={handleRandomize}>Randomize Week</button>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            {mealTypes.map(mt => <th key={mt}>{mt}</th>)}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dIdx) => (
            <tr key={day}>
              <td>{day}</td>
              {mealTypes.map((mt, mIdx) => (
                <td key={mt}>
                  <select
                    value={plan[dIdx][mIdx] || ''}
                    onChange={e => handleSelect(dIdx, mIdx, e.target.value)}
                  >
                    <option value=''>--Select--</option>
                    {recipes.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MealPlan;