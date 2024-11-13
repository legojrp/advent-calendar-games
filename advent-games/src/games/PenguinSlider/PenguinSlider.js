import React, { useState, useEffect } from 'react';

// PenguinSlider component
const PenguinSlider = () => {
  const objects = [
    { id: 'web', weight: 0.05, symbol: '🕸️' },
    { id: 'building', weight: 0.01, symbol: '🏢' },
    { id: 'oilDrum', weight: 0.1, symbol: '🛢️' },
    { id: 'iceberg', weight: 0.5, symbol: '🧊' },
    { id: 'penguin', weight: 0.5, symbol: '🐧' },
    { id: 'hole', weight: 2, symbol: '🕳️' },
    { id: 'rock', weight: 2, symbol: '🪨' },
  ];
  const gridSize = 500; // Grid dimensions (in pixels)
  const stepSize = 50; // Step size for scenery movement
  const [penguinPos, setPenguinPos] = useState({ x: gridSize / 2, y: gridSize - stepSize });
  const [fishPos, setFishPos] = useState(getRandomPosition());
  const [obstacles, setObstacles] = useState(generateObstacles());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);


  // Helper function to generate a random position at the top of the grid
  function getRandomPosition() {
    return {
      x: Math.floor(Math.random() * (gridSize / stepSize)) * stepSize,
      y: 0, // Start fish at the top to slide down
    };
  }
  function getRandomObject() {
    const totalWeight = objects.reduce((acc, object) => acc + object.weight, 0);
    const random = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    for (const object of objects) {
      cumulativeWeight += object.weight;
      if (random <= cumulativeWeight) {
        return object;
      }
    }
    return objects[objects.length - 1]; // default to the last object
  }


  // Generate obstacles with random positions at the top
  // Generate obstacles with random positions at the top
function generateObstacles() {
  const obstacles = [];
  let previousObstacle;

  while (obstacles.length < 3) {
    const obstacle = getRandomObject();
    if (obstacle.id !== previousObstacle?.id) {
      obstacles.push({
        type: obstacle.id,
        symbol: obstacle.symbol,
        pos: getRandomPosition(),
      });
      previousObstacle = obstacle;
    }
  }

  return obstacles;
}
  // Reset game state on game over
  function resetGame() {
    setPenguinPos({ x: gridSize / 2, y: gridSize - stepSize });
    setFishPos(getRandomPosition());
    setObstacles(generateObstacles());
    setScore(0);
    setGameOver(false);
  }

  // Move the scenery down, check for collision with penguin, and handle scoring
  function moveScenery() {
    if (gameOver) return;

    // Move fish and obstacles down
    setFishPos(prev => ({ x: prev.x, y: prev.y + stepSize }));
    setObstacles(prev =>
      prev.map(obstacle => ({
        ...obstacle,
        pos: { x: obstacle.pos.x, y: obstacle.pos.y + stepSize },
      }))
    );
    if (fishPos.y > penguinPos.y) {
      setFishPos(getRandomPosition()); // Add a new fish
    }

    // Check for collision with fish
    if (penguinPos.x === fishPos.x && penguinPos.y === fishPos.y) {
      setScore(score + 1);
      setFishPos(getRandomPosition());
    }

    // Check for collision with any obstacle
    for (let obstacle of obstacles) {
      if (penguinPos.x === obstacle.pos.x && penguinPos.y === obstacle.pos.y) {
        setGameOver(true);
      }
    }

    // Remove obstacles that have moved off-screen, and add new ones
    setObstacles(prev =>
      prev
        .filter(obstacle => obstacle.pos.y < gridSize)
        .concat(generateObstacles())
    );
  }

  // Move penguin with arrow keys
  useEffect(() => {
    function handleKeyDown(event) {
      if (gameOver) return;

      let { x, y } = penguinPos;
      switch (event.key) {
        case 'ArrowLeft':
          x = Math.max(0, x - stepSize);
          break;
        case 'ArrowRight':
          x = Math.min(gridSize - stepSize, x + stepSize);
          break;
        default:
          return;
      }
      setPenguinPos({ x, y });
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [penguinPos, gameOver]);

  // Move scenery automatically
  useEffect(() => {
    const interval = setInterval(moveScenery, 500);
    return () => clearInterval(interval);
  }, [fishPos, obstacles]);

  return (
    <div style={{
      textAlign: 'center',
      color: '#fff',
      backgroundColor: '#87CEEB', // Light blue for winter theme
      padding: '20px',
    }}>
      <div style={{
        position: 'relative',
        width: `${gridSize}px`,
        height: `${gridSize}px`,
        margin: '0 auto',
        border: '2px solid #fff',
        backgroundColor: '#b0e0e6', // Light icy blue
      }}>
        <h2 style={{ position: 'absolute', top: '0px', left: '10px' }}>Penguin Slide</h2>
        <h4 style={{ position: 'absolute', top: '30px', left: '10px' }}>By HSE Apps</h4>
        <h6 style={{ position: 'absolute', top: '50px', left: '10px' }}>December 3rd</h6>
        <h3 style={{ position: 'absolute', top: '0px', right: '10px' }}>Score: {score}</h3>
        {/* Penguin */}
        <div style={{
          position: 'absolute',
          fontSize: '24px',
          left: penguinPos.x,
          top: penguinPos.y,
          transition: 'top 0.3s ease, left 0.3s ease', // Smooth movement
        }}>🐧</div>
        {/* Fish */}
        <div style={{
          position: 'absolute',
          fontSize: '24px',
          left: fishPos.x,
          top: fishPos.y,
        }}>🐟</div>
        {/* Obstacles */}
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              fontSize: '24px',
              left: obstacle.pos.x,
              top: obstacle.pos.y,
            }}
          >
            {obstacle.symbol}
          </div>
        ))}
        {gameOver && (
          <div style={{ position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)' }}>
            <h3>Game Over</h3>
            <button onClick={resetGame}>Restart Game</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenguinSlider;
