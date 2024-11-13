import React, { useState, useEffect, useRef } from "react";
import "./SnowballCatch.css"; // Import CSS for styling

const SnowballCatch = () => {
  // Set initial states
  const [bucketX, setBucketX] = useState(250); // X-position of the bucket
  const [snowballs, setSnowballs] = useState([]); // Array to hold snowballs
  const [score, setScore] = useState(0); // Player score
  const [snowballSpeed, setSnowballSpeed] = useState(2); // Initial speed of snowballs
  const gameAreaRef = useRef(null); // Reference for the game area
  let gameLoop;
  let debounceTimeout = null;
  // Key press handler to move bucket left or right
  const handleKeyDown = (e) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  
    debounceTimeout = setTimeout(() => {
      // Update bucketX state here
      if (e.key === "ArrowLeft") {
        setBucketX((prevX) => Math.max(prevX - 20, 0));
      } else if (e.key === "ArrowRight") {
        setBucketX((prevX) => Math.min(prevX + 20, 500 - 50));
      }
    }, 100); // Adjust the delay time as needed
  };

  // Function to create a new snowball at a random X-position at the top of the screen
  const createSnowball = () => {
    const xPosition = Math.floor(Math.random() * 500);
    setSnowballs((prev) => [...prev, { x: xPosition, y: 0 }]);
  };

  // Move snowballs downward and check for collision with the bucket
  const updateSnowballs = () => {
    setSnowballs((prev) =>
      prev
        .map((snowball) => ({ ...snowball, y: snowball.y + snowballSpeed }))
        .filter((snowball) => {
          // Check if snowball is caught by the bucket
          const isCaught =
            snowball.y > 450 &&
            snowball.y < 500 &&
            snowball.x > bucketX - 20 &&
            snowball.x < bucketX + 55;
          console.log(bucketX, "bucket");
          if (isCaught) setScore((prevScore) => prevScore + 5); // Increase score
          if (snowball.y >= 700) setScore((prevScore) => prevScore - 1); // Decrease score if snowball is out of bounds
          return !isCaught && snowball.y < 700; // Filter out caught or out-of-bounds snowballs
        })
    );
  };

  // Increase snowball speed every 10 seconds
  useEffect(() => {
    const speedIncreaseInterval = setInterval(() => {
      setSnowballSpeed((speed) => speed *1.1);
    }, 10000);
    return () => clearInterval(speedIncreaseInterval);
  }, []);

  // Create new snowballs at regular intervals
  useEffect(() => {
    const snowballInterval = setInterval(createSnowball, 1000);
    return () => clearInterval(snowballInterval);
  }, []);

  // Move snowballs and handle key events
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    gameLoop = setInterval(updateSnowballs, 50);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameLoop);
    };
  }, [bucketX, snowballSpeed]);

  return (
    <div className="game-area" ref={gameAreaRef}>
      <div style={{ lineHeight: 0.5 }}>
        <h1>Snowball Catch</h1>
        <h3 style={{} }>By HSE Apps</h3>
        <h5 style={{ marginTop: 0 }}>December 2nd</h5>
      </div>
      <p>Score: {score}</p>
      {/* Render bucket */}
      <div
        className="bucket"
        style={{
          left: `${bucketX}px`,
        }}
      />
      {/* Render snowballs */}
      {snowballs.map((snowball, index) => (
        <div
          key={index}
          className="snowball"
          style={{
            left: `${snowball.x}px`,
            top: `${snowball.y}px`,
          }}
        />
      ))}
    </div>
  );
};

export default SnowballCatch;
