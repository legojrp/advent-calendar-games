import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const SnowflakeCatcher = () => {
  const [snowflakes, setSnowflakes] = useState([]);
  const [basketX, setBasketX] = useState(window.innerWidth / 2 - 50);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const basketWidth = 100;
  const snowflakeSpeed = 2;
  const snowflakeSize = 20;
  const frameRate = 1000 / 60; // 60 FPS

  const lastFrameTime = useRef(0); // Store time of the last frame

  // Handle snowflake movement
  const moveSnowflakes = () => {
    setSnowflakes((prevSnowflakes) =>
      prevSnowflakes
        .map((snowflake) => ({
          ...snowflake,
          y: snowflake.y + snowflakeSpeed,
        }))
        .filter((snowflake) => snowflake.y < window.innerHeight) // Remove snowflakes that fall below the screen
    );
  };

  // Check for collisions and update score
  const checkCollisions = () => {
    const basketLeft = basketX;
    const basketRight = basketX + basketWidth;

    let caughtCount = 0;

    const remainingSnowflakes = snowflakes.filter((snowflake) => {
      // Check if snowflake is at basket level and within the basket's left-right bounds
      if (
        snowflake.y + snowflakeSize >= window.innerHeight - 50 && // It's at the basket level
        snowflake.x >= basketLeft && // Snowflake is inside the basket's left boundary
        snowflake.x <= basketRight // Snowflake is inside the basket's right boundary
      ) {
        caughtCount++; // Increase score for each snowflake caught
        return false; // Remove this snowflake from the list
      }
      return true;
    });

    setSnowflakes(remainingSnowflakes); // Remove caught snowflakes from state
    setScore((prevScore) => prevScore + caughtCount); // Increase score by number of caught snowflakes
  };

  // Randomly spawn fewer snowflakes with slower rate
  const spawnSnowflake = () => {
    if (Math.random() < 0.05) { // Lower probability to spawn a snowflake
      const x = Math.random() * (window.innerWidth - snowflakeSize);
      setSnowflakes((prevSnowflakes) => [
        ...prevSnowflakes,
        { x, y: -snowflakeSize },
      ]);
    }
  };

  // Handle keyboard events for basket movement
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" && basketX > 0) {
      setBasketX(basketX - 20);
    } else if (e.key === "ArrowRight" && basketX < window.innerWidth - basketWidth) {
      setBasketX(basketX + 20);
    }
  };

  // Handle mouse movement for basket control
  const handleMouseMove = (e) => {
    setBasketX(e.clientX - basketWidth / 2);
  };

  // Game loop using requestAnimationFrame with fixed time step for 60 FPS
  const gameLoop = (timestamp) => {
    if (gameOver) return;

    // Calculate time difference from last frame
    const deltaTime = timestamp - lastFrameTime.current;
    if (deltaTime < frameRate) {
      requestAnimationFrame(gameLoop);
      return;
    }

    lastFrameTime.current = timestamp;

    moveSnowflakes();
    checkCollisions();
    spawnSnowflake();

    // Schedule next frame
    requestAnimationFrame(gameLoop);
  };

  // Start the game loop
  useEffect(() => {
    if (!gameOver) {
      requestAnimationFrame(gameLoop);
    }
  }, [snowflakes, basketX, score, gameOver]);

  // Handle mouse move event listener
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle keyboard event listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [basketX]);

  // Styling the game
  const gameStyle = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#87CEEB",
    overflow: "hidden",
  };

  const basketStyle = {
    position: "absolute",
    bottom: "50px",
    left: basketX,
    width: basketWidth,
    height: "30px",
    backgroundColor: "#654321",
    borderRadius: "5px",
  };

  const snowflakeStyle = (x, y) => ({
    position: "absolute",
    top: y,
    left: x,
    width: snowflakeSize,
    height: snowflakeSize,
    backgroundColor: "#FFFFFF",
    borderRadius: "50%",
  });

  return (
    <div style={gameStyle}>
      {snowflakes.map((snowflake, index) => (
        <div
          key={index}
          style={snowflakeStyle(snowflake.x, snowflake.y)}
        ></div>
      ))}
      <div style={basketStyle}></div>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Score: {score}
      </div>
      {gameOver && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "36px",
            fontWeight: "bold",
            color: "#FF0000",
          }}
        >
          Game Over!
        </div>
      )}
    </div>
  );
};

export default SnowflakeCatcher;  