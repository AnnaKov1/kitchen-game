interface Dish {
    name: string;
    emoji: string;
    ingredients: string[];
}

const dishes: Dish[] = [
    { name: "Toast", emoji: "🍞", ingredients: ["🍞", "🧈"] },
    { name: "Salad", emoji: "🥗", ingredients: ["🥬", "🥕", "🥒"] },
    { name: "Hot Dog", emoji: "🌭", ingredients: ["🌭", "🍞", "🧅"] },
    { name: "Pizza", emoji: "🍕", ingredients: ["🍞", "🍅", "🧀"] },
    { name: "Pasta", emoji: "🍝", ingredients: ["🍝", "🍅", "🧀", "🌿"] },
    { name: "Burger", emoji: "🍔", ingredients: ["🥩", "🍞", "🧀", "🍅", "🥬"] },
    { name: "Taco", emoji: "🌮", ingredients: ["🌮", "🥩", "🧀", "🥬", "🍅"] },
    { name: "Sushi", emoji: "🍣", ingredients: ["🍚", "🐟", "🥢", "🥑", "🍋"] },
    { name: "Ramen", emoji: "🍜", ingredients: ["🍜", "🥩", "🥚", "🌿", "🧄", "🧅"] },
    { name: "Feast", emoji: "🍽️", ingredients: ["🍗", "🍖", "🍞", "🍷", "🥗", "🧁", "🍇"] }
];

let score = 0;
let timeLeft = 60;
let currentDish: Dish | null = null;
let requiredIngredients: string[] = [];
let selectedIngredients: string[] = [];
let gameOver = false;

const orderDisplay = document.getElementById("order-display");
const ingredientTray = document.getElementById("ingredient-tray");
const preparationArea = document.getElementById("preparation-area");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

function startGame(): void {
    generateOrder();
    updateScore();
    startTimer();
}

function generateOrder(): void {
    if (gameOver) return;
    const randomIndex = Math.floor(Math.random() * dishes.length);
    currentDish = dishes[randomIndex];

    if (!currentDish) return;

    requiredIngredients = currentDish.ingredients.slice();
    const trayIngredients = generateIngredientTray(requiredIngredients);
    updateOrderDisplay();
    displayIngredientTray(trayIngredients);
}

function updateOrderDisplay(): void {
    if (!currentDish) return;

    const currentDishElement = document.getElementById("current-dish");

    if (currentDishElement) {
        currentDishElement.innerText = `${currentDish.name} ${currentDish.emoji}`;
    }
}

function generateIngredientTray(requiredIngredients: string[]): string[] {
    const allIngredients = ["🍞", "🍅", "🧀", "🥬", "🥕", "🥒", "🌭", "🧅", "🧈", "🍝", "🌿", "🥩", "🍚", "🐟", "🥢", "🥑", "🍋", "🍗", "🍖", "🍷", "🧁", "🍇"];
    const tray = [];
    const usedIngredients = [];

    for (let i = 0; i < requiredIngredients.length; i++) {
        tray.push(requiredIngredients[i]);
        usedIngredients.push(requiredIngredients[i]);
    }

    while (tray.length < 22) {
        const randomIndex = Math.floor(Math.random() * allIngredients.length);
        const randomIngredient = allIngredients[randomIndex];
        let alreadyUsed = false;

        for (let j = 0; j < usedIngredients.length; j++) {
            if (usedIngredients[j] === randomIngredient) {
                alreadyUsed = true;
                break;
            }
        }

        if (!alreadyUsed) {
            tray.push(randomIngredient);
            usedIngredients.push(randomIngredient);
        }
    }

    return tray;
}

function displayIngredientTray(ingredients: string[]): void {
    if (ingredientTray) {
        ingredientTray.innerHTML = "";
        for (let i = 0; i < ingredients.length; i++) {
            const span = document.createElement("span");
            span.innerText = ingredients[i];
            span.style.cursor = "pointer";
            span.onclick = function () {
                addToPreparation(ingredients[i]);
            };
            ingredientTray.appendChild(span);
        }
    } else {
        console.error("Ingredient tray not found!");
    }
}

function addToPreparation(ingredient: string): void {
    if (gameOver) return;

    let alreadySelected = false;

    for (let i = 0; i < selectedIngredients.length; i++) {
        if (selectedIngredients[i] === ingredient) {
            alreadySelected = true;
            break;
        }
    }

    if (!alreadySelected) {
        selectedIngredients.push(ingredient);
        updatePreparationArea();
    }

    if (selectedIngredients.length === requiredIngredients.length) {
        validateOrder();
    }
}

function updatePreparationArea(): void {
    if (preparationArea) {
        let preparationContent = "";
        for (let i = 0; i < selectedIngredients.length; i++) {
            preparationContent += `<span>${selectedIngredients[i]}</span>`;
        }
        preparationArea.innerHTML = preparationContent;
    }
}

function validateOrder(): void {
    if (gameOver) return;

    let isValid = true;

    if (selectedIngredients.length === requiredIngredients.length) {
        for (let i = 0; i < requiredIngredients.length; i++) {
            let found = false;
            for (let j = 0; j < selectedIngredients.length; j++) {
                if (selectedIngredients[j] === requiredIngredients[i]) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                isValid = false;
                break;
            }
        }
    } else {
        isValid = false;
    }

    if (isValid) {
        score += 100;
        alert("Correct order! 100 points added.");
    } else {
        score -= 50;
        alert("Incorrect order! 50 points deducted.");
    }

    updateScore();
    resetPreparationArea();
    generateOrder();
}

function resetPreparationArea(): void {
    selectedIngredients = [];
    if (preparationArea) {
        preparationArea.innerHTML = "Drop ingredients here!";
    }
}

function updateScore(): void {
    if (scoreDisplay) {
        scoreDisplay.innerText = score.toString();
    }
}

function startTimer(): void {
    const timerInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(timerInterval);
            return;
        }

        if (timeLeft > 0) {
            timeLeft--;
            if (timerDisplay) {
                timerDisplay.innerText = timeLeft.toString();
            }
        } else {
            clearInterval(timerInterval);
            if (timerDisplay) {
                timerDisplay.innerText = "0";
            }
            gameOver = true;
            alert(`Game Over! Your Score: ${score}`);
        }
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    function saveGame() {
        const gameState = {
            score,
            timeLeft,
            currentDish,
            requiredIngredients,
            selectedIngredients,
            gameOver
        };
        localStorage.setItem("gameState", JSON.stringify(gameState));
        alert("Game Saved!");
    }

    function loadGame() {
        const savedGame = localStorage.getItem("gameState");
        if (savedGame) {
            const gameState = JSON.parse(savedGame);
            score = gameState.score;
            timeLeft = gameState.timeLeft;
            currentDish = gameState.currentDish;
            requiredIngredients = gameState.requiredIngredients;
            selectedIngredients = gameState.selectedIngredients;
            gameOver = gameState.gameOver;

            updateScore();
            updateOrderDisplay();
            updatePreparationArea();
            alert("Game Loaded!");
        } else {
            alert("No saved game found.");
        }
    }

    const saveButton = document.createElement("button");
    saveButton.innerText = "Save Game";
    saveButton.onclick = saveGame;

    const loadButton = document.createElement("button");
    loadButton.innerText = "Load Game";
    loadButton.onclick = loadGame;

    const controlsDiv = document.querySelector(".controls");
    if (controlsDiv) {
        controlsDiv.appendChild(saveButton);
        controlsDiv.appendChild(loadButton);
    } else {
        console.error("Controls div not found!");
    }

    console.log("Save and Load buttons initialized.");
});

startGame();

if (preparationArea) {
    preparationArea.addEventListener("dblclick", validateOrder);
}

