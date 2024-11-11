// SnowboardGame.js
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls, useGLTF } from '@react-three/drei';

function SnowboardGame() {
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  
  // Generate random obstacles
  useEffect(() => {
    const generateObstacles = () => {
      const newObstacles = Array.from({ length: 50 }, () => ({
        position: [Math.random() * 10 - 5, 0.5, -Math.random() * 100],
        type: Math.random() > 0.5 ? 'tree' : 'rock',
      }));
      setObstacles(newObstacles);
    };
    generateObstacles();
  }, []);
  
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        <Physics>
          <Snowboarder setScore={setScore} setGameOver={setGameOver} />
          <Slope />
          {obstacles.map((obs, index) => (
            <Obstacle key={index} position={obs.position} type={obs.type} />
          ))}
        </Physics>
        <OrbitControls />
      </Canvas>
      <div className="score">Score: {score}</div>
      {gameOver && <div className="game-over">Game Over!</div>}
    </div>
  );
}

// Snowboarder Component
function Snowboarder({ setScore, setGameOver }) {
  const [ref, api] = useBox(() => ({ mass: 1, position: [0, 1, 0] }));
  const speed = useRef(0);
  
  useFrame((state) => {
    api.velocity.set(0, 0, -5 - speed.current);
    speed.current += 0.01; // Increase speed over time

    const [x, y, z] = ref.current.position;
    if (z < -50) setGameOver(true); // End game on out of bounds
  });

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[0.5, 0.2, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

// Slope Component
function Slope() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#d8f0fa" />
    </mesh>
  );
}

// Obstacle Component
function Obstacle({ position, type }) {
  const [ref] = useBox(() => ({ position, type: 'Static' }));
  
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <cylinderGeometry args={[0.2, 0.5, 1, 8]} />
      <meshStandardMaterial color={type === 'tree' ? 'green' : 'gray'} />
    </mesh>
  );
}

export default SnowboardGame;
