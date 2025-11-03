// BMR Calculation using Mifflin-St Jeor Equation
export const calculateCalorieGoal = (age, height, weight, gender) => {
    let bmr;
  
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
  
    return Math.round(bmr * 1.2); // sedentary activity multiplier
  };
  