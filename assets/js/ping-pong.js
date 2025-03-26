// Ping Pong Game
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('pingPongCanvas');
  const ctx = canvas.getContext('2d');
  
  // Make canvas responsive
  function resizeCanvas() {
    const containerWidth = canvas.parentElement.clientWidth;
    const maxWidth = 600; // Original width
    const scaleFactor = Math.min(1, containerWidth / maxWidth);
    
    canvas.style.width = (maxWidth * scaleFactor) + 'px';
    // Height maintains aspect ratio
    canvas.style.height = (200 * scaleFactor) + 'px';
  }
  
  // Call once to set initial size
  resizeCanvas();
  
  // Resize canvas when window size changes
  window.addEventListener('resize', resizeCanvas);
  
  // Game variables
  let ballX = canvas.width / 2;
  let ballY = canvas.height / 2;
  let ballRadius = 10;
  let ballSpeedX = 3;
  let ballSpeedY = 3;
  
  const paddleHeight = 60;
  const paddleWidth = 10;
  let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
  let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
  const paddleSpeed = 4;
  
  let computerSpeed = 3;
  let playerScore = 0;
  let computerScore = 0;
  
  // Control the paddle with mouse movement
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    movePaddle(mouseY);
  });
  
  // Touch controls for mobile
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling when touching the canvas
    const rect = canvas.getBoundingClientRect();
    const touchY = e.touches[0].clientY - rect.top;
    movePaddle(touchY);
  }, { passive: false });
  
  // Touch start for mobile
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    const rect = canvas.getBoundingClientRect();
    const touchY = e.touches[0].clientY - rect.top;
    movePaddle(touchY);
  }, { passive: false });
  
  // Common function to move paddle based on input position
  function movePaddle(inputY) {
    leftPaddleY = inputY - paddleHeight / 2;
    
    // Keep paddle within canvas bounds
    if (leftPaddleY < 0) {
      leftPaddleY = 0;
    }
    if (leftPaddleY > canvas.height - paddleHeight) {
      leftPaddleY = canvas.height - paddleHeight;
    }
  }
  
  // Draw functions
  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0f0';
    ctx.fill();
    ctx.closePath();
  }
  
  function drawPaddles() {
    // Left paddle (player)
    ctx.fillStyle = '#0f0';
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    
    // Right paddle (computer)
    ctx.fillStyle = '#0f0';
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
  }
  
  function drawScore() {
    ctx.font = '16px "Comic Sans MS", cursive, sans-serif';
    ctx.fillStyle = '#0f0';
    ctx.fillText(`You: ${playerScore}`, 50, 20);
    ctx.fillText(`CPU: ${computerScore}`, canvas.width - 100, 20);
  }
  
  function drawNet() {
    for (let i = 0; i < canvas.height; i += 15) {
      ctx.fillStyle = '#0f0';
      ctx.fillRect(canvas.width / 2 - 1, i, 2, 10);
    }
  }
  
  // Computer AI
  function moveComputer() {
    const paddleCenter = rightPaddleY + paddleHeight / 2;
    
    if (paddleCenter < ballY - 10) {
      rightPaddleY += computerSpeed;
    } else if (paddleCenter > ballY + 10) {
      rightPaddleY -= computerSpeed;
    }
    
    // Keep paddle within canvas bounds
    if (rightPaddleY < 0) {
      rightPaddleY = 0;
    }
    if (rightPaddleY > canvas.height - paddleHeight) {
      rightPaddleY = canvas.height - paddleHeight;
    }
  }
  
  // Update ball position and handle collisions
  function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Top and bottom walls
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }
    
    // Left paddle collision
    if (
      ballX - ballRadius < paddleWidth &&
      ballY > leftPaddleY &&
      ballY < leftPaddleY + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
      // Adjust angle based on where ball hits paddle
      const impact = ballY - (leftPaddleY + paddleHeight / 2);
      ballSpeedY = impact * 0.2;
    }
    
    // Right paddle collision
    if (
      ballX + ballRadius > canvas.width - paddleWidth &&
      ballY > rightPaddleY &&
      ballY < rightPaddleY + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
      // Adjust angle based on where ball hits paddle
      const impact = ballY - (rightPaddleY + paddleHeight / 2);
      ballSpeedY = impact * 0.2;
    }
    
    // Score points
    if (ballX < 0) {
      computerScore++;
      resetBall();
    } else if (ballX > canvas.width) {
      playerScore++;
      resetBall();
    }
  }
  
  function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = Math.random() * 6 - 3;
  }
  
  // Main game loop
  function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw everything
    drawNet();
    drawBall();
    drawPaddles();
    drawScore();
    drawInstructions();
    
    // Update game state
    moveComputer();
    updateBall();
    
    // Continue the loop
    requestAnimationFrame(gameLoop);
  }
  
  // Add instructions for mobile users
  function drawInstructions() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      ctx.font = '14px "Comic Sans MS", cursive, sans-serif';
      ctx.fillStyle = '#0f0';
      ctx.fillText('Touch and drag to move paddle', canvas.width/2 - 100, canvas.height - 10);
    }
  }
  
  // Start the game
  gameLoop();
});
