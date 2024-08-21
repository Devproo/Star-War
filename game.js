// Get the canvas and its context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set up game variables
const player = {
  x: canvas.width / 2 - 25, // Start in the center horizontally
  y: canvas.height - 60, // Near the bottom of the canvas
  width: 50,
  height: 50,
  speed: 5,
  bullets: [], // Array to store bullets
};

const enemy = {
  x: Math.random() * (canvas.width - 50),
  y: -50,
  width: 50,
  height: 50,
  speed: 2,
};

let score = 0;

// Load images and sounds
const shipImg = new Image();
shipImg.src = "images/ship-image.png"; // Update with the path to your ship image

const bulletImg = new Image();
bulletImg.src = "images/bullet-image.png"; // Update with the path to your bullet image

const hitSound = new Audio("sounds/hit.wav"); // Update with the path to your hit sound
const shootSound = new Audio("sounds/shoot.wav"); // Update with the path to your shoot sound
const gameOverSound = new Audio("sounds/game-over.wav"); // Update with the path to your game over sound

// Function to draw the player
function drawPlayer() {
  ctx.drawImage(shipImg, player.x, player.y, player.width, player.height);
}

// Function to draw the bullets
function drawBullets() {
  player.bullets.forEach((bullet) => {
    ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// Function to draw the enemy
function drawEnemy() {
  ctx.fillStyle = "red";
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

// Function to move the player
function movePlayer() {
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "ArrowLeft":
        player.x -= player.speed;
        if (player.x < 0) player.x = 0; // Prevent the player from moving off the left edge
        break;
      case "ArrowRight":
        player.x += player.speed;
        if (player.x + player.width > canvas.width)
          player.x = canvas.width - player.width; // Prevent the player from moving off the right edge
        break;
      case " ":
        shoot(); // Call the shoot function when spacebar is pressed
        break;
    }
  });
}

// Function to move bullets
function moveBullets() {
  player.bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed; // Move the bullet up
    if (bullet.y < 0) {
      player.bullets.splice(index, 1); // Remove the bullet if it goes off-screen
    }
  });
}

// Function to move the enemy
function moveEnemy() {
  enemy.y += enemy.speed;
  if (enemy.y > canvas.height) {
    // Reset enemy position if it goes off-screen
    enemy.x = Math.random() * (canvas.width - enemy.width);
    enemy.y = -enemy.height;
  }
}

// Function to check collisions between bullets and the enemy
function checkCollisions() {
  player.bullets.forEach((bullet, bulletIndex) => {
    if (
      bullet.x < enemy.x + enemy.width &&
      bullet.x + bullet.width > enemy.x &&
      bullet.y < enemy.y + enemy.height &&
      bullet.y + bullet.height > enemy.y
    ) {
      // Collision detected
      player.bullets.splice(bulletIndex, 1); // Remove the bullet
      enemy.x = Math.random() * (canvas.width - enemy.width); // Reset enemy position
      enemy.y = -enemy.height;
      increaseScore(10); // Increase score and update display
      hitSound.play(); // Play hit sound
    }
  });

  // Check for collision between player and enemy
  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    // Player-enemy collision detected
    gameOverSound.play(); // Play game over sound
    alert("Game Over! Final Score: " + score);
    document.location.reload(); // Reload the page to restart the game
  }
}

// Function to update the score display
function updateScore() {
  document.getElementById("score").textContent = "Score: " + score;
}

// Function to increase the score
function increaseScore(amount) {
  score += amount;
  updateScore(); // Update the display with the new score
}

// Function to shoot a bullet
function shoot() {
  const bulletWidth = 5;
  const bulletHeight = 10;
  player.bullets.push({
    x: player.x + player.width / 2 - bulletWidth / 2, // Center the bullet horizontally
    y: player.y,
    width: bulletWidth,
    height: bulletHeight,
    speed: 7,
  });
  shootSound.play(); // Play shoot sound
}

// Function to update game elements and draw them
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawPlayer();
  drawBullets();
  drawEnemy();
  moveBullets();
  moveEnemy();
  checkCollisions();
  requestAnimationFrame(update); // Continue updating
}

// Initialize the game
function init() {
  movePlayer(); // Set up player controls
  update(); // Start the game loop
}

// Start the game
init();

console.log("Started");
