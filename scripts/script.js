
// loads JSON data and passes these to the displayRecipeNames function
fetch('data/recipes.json')
    .then(response => response.json())
    .then(recipesData => {
        displayRecipeNames(recipesData);
    })
    .catch(error => console.error('Error loading JSON file:', error));

// displays the recipe names in the recipe-list div 
function displayRecipeNames(recipesData) {
    const recipeList = document.getElementById('recipe-list');
    
    // loop through the recipesData array and create an anchor element for each recipe
    recipesData.forEach((recipe, index) => {
        const recipeItem = document.createElement('div'); 
        const recipeLink = document.createElement('a');
        
        recipeLink.href = "#";
        recipeLink.textContent = recipe.name;
        recipeLink.onclick = () => displayRecipeDetails(recipesData[index]);
    
        // append the anchor element to the recipeItem div and the recipeItem div to the recipeList div
        recipeItem.appendChild(recipeLink);
        recipeList.appendChild(recipeItem);
    });
}

// displays the recipe details in the recipe-info div
function displayRecipeDetails(recipe) {
    const recipeInfo = document.getElementById('recipe-info');
    
    recipeInfo.style.display = 'block';
    recipeInfo.innerHTML = '';

    // create elements for the recipe details
    const recipeTitle = document.createElement('h2');
    recipeTitle.textContent = recipe.name;

    const recipeImage = document.createElement('img');
    recipeImage.src = recipe.image;
    recipeImage.alt = recipe.name;
    recipeImage.style.width = '100%';

    const recipeDescription = document.createElement('p');
    recipeDescription.textContent = recipe.description;

    const prepTime = document.createElement('p');
    prepTime.textContent = `Prep Time: ${formatTime(recipe.prepTime)}`;

    const cookTime = document.createElement('p');
    cookTime.textContent = `Cook Time: ${formatTime(recipe.cookTime)}`;

    const servings = document.createElement('p');
    servings.textContent = `Servings: ${recipe.servings}`;
    servings.id = 'servings';

    const ingredientsTitle = document.createElement('h3');
    ingredientsTitle.textContent = 'Ingredients';

    // create an unordered list of ingredients
    const ingredientsList = document.createElement('ul');
    recipe.ingredients.forEach(ingredient => {
        const item = document.createElement('li');
        item.textContent = `${ingredient.amount} ${ingredient.unit} ${ingredient.item}`;
        item.dataset.originalAmount = ingredient.amount;
        item.dataset.unit = ingredient.unit;
        ingredientsList.appendChild(item);
    });

    // create a ordered list of instructions
    const instructionsTitle = document.createElement('h3');
    instructionsTitle.textContent = 'Instructions';
    const instructionsList = document.createElement('ol');
    recipe.instructions.forEach(step => {
        const stepItem = document.createElement('li');
        stepItem.textContent = step.text;
        instructionsList.appendChild(stepItem);
    });

    // create buttons for doubling servings
    const doubleServingsButton = document.createElement('button');
    doubleServingsButton.textContent = "Double the Servings";
    doubleServingsButton.onclick = () => doubleServings(recipe);

    // create buttons for converting units
    const convertToImperialButton = document.createElement('button');
    convertToImperialButton.textContent = "Convert to Imperial";
    convertToImperialButton.onclick = () => {
        convertToImperial(recipe);
        convertToImperialButton.style.display = 'none';
        convertToMetricButton.style.display = 'inline';
    };

    // does the opposite of convertToImperial
    const convertToMetricButton = document.createElement('button');
    convertToMetricButton.textContent = "Convert to Metric";
    convertToMetricButton.style.display = 'none';
    convertToMetricButton.onclick = () => {
        convertToMetric(recipe);
        convertToImperialButton.style.display = 'inline';
        convertToMetricButton.style.display = 'none';
    };

    // append the elements to the recipeInfo div
    recipeInfo.appendChild(recipeTitle);
    recipeInfo.appendChild(recipeImage);
    recipeInfo.appendChild(recipeDescription);
    recipeInfo.appendChild(prepTime);
    recipeInfo.appendChild(cookTime);
    recipeInfo.appendChild(servings);
    recipeInfo.appendChild(doubleServingsButton);
    recipeInfo.appendChild(convertToImperialButton);
    recipeInfo.appendChild(convertToMetricButton);
    recipeInfo.appendChild(ingredientsTitle);
    recipeInfo.appendChild(ingredientsList);
    recipeInfo.appendChild(instructionsTitle);
    recipeInfo.appendChild(instructionsList);
}

// formats the time in minutes to hours and minutes
function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes} minutes`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes ? remainingMinutes + ' minutes' : ''}`;
    }
}

// doubles the servings and updates the ingredients list
function doubleServings(recipe) {
    const servingsElement = document.getElementById('servings');
    servingsElement.textContent = `Servings: ${recipe.servings * 2}`;

    const ingredientsList = document.querySelectorAll('#recipe-info ul li');
    ingredientsList.forEach((item, index) => {
        const originalAmount = parseFloat(item.dataset.originalAmount);
        item.textContent = `${originalAmount * 2} ${recipe.ingredients[index].unit} ${recipe.ingredients[index].item}`;
    });
}

// converts the units of the ingredients to imperial units
function convertToImperial(recipe) {
    const ingredientsList = document.querySelectorAll('#recipe-info ul li');
    
    ingredientsList.forEach(item => {
        let amount = parseFloat(item.dataset.originalAmount);
        let unit = item.dataset.unit;

        if (unit === 'grams') {
            amount = (amount * 0.035274).toFixed(2);
            unit = 'oz';
        } else if (unit === 'milliliters') {
            amount = (amount * 0.033814).toFixed(2);
            unit = 'fl oz';
        } else if (unit === 'kilograms') {
            amount = (amount * 2.20462).toFixed(2);
            unit = 'lbs';
        } else if (unit === 'liters') {
            amount = (amount * 1.05669).toFixed(2);
            unit = 'qt';
        }

        item.textContent = `${amount} ${unit} ${item.textContent.split(' ').slice(2).join(' ')}`;
    });
}

// converts the units of the ingredients to metric units
function convertToMetric(recipe) {
    const ingredientsList = document.querySelectorAll('#recipe-info ul li');
    
    ingredientsList.forEach(item => {
        const amount = parseFloat(item.dataset.originalAmount);
        const unit = item.dataset.unit;
        item.textContent = `${amount} ${unit} ${item.textContent.split(' ').slice(2).join(' ')}`;
    });
}
