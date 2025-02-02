import { useState, useEffect, useRef } from "react";

export default function ValentineApp() {
  const [page, setPage] = useState(0); // Start with Page 0

  return page === 0 ? <LandingPage onContinue={() => setPage(1)} /> : <ValentineInvite />;
}

// Page 0 - Landing Page
function LandingPage({ onContinue }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <img src="/Afif.jpg" alt="Kakow!" className="w-64 h-64 mb-4 rounded-lg shadow-lg" />
      <h1 className="text-4xl sm:text-3xl lg:text-5xl font-bold font-serif max-w-lg whitespace-nowrap">Dearest Sarrah Hanis,</h1>
      <p className="text-lg mt-2 font-serif max-w-xl">i have a really important question for you</p>
      <button
        onClick={onContinue}
        className="font-serif mt-6 px-6 py-3 bg-pink-500 text-white rounded-full text-lg shadow-lg hover:bg-green-600"
      >
      continue 
      </button>
    </div>
  );
}

// Page 1 - Valentine Invite Page
function ValentineInvite() {
  const [response, setResponse] = useState(null);
  const [noClickCount, setNoClickCount] = useState(0);

  const noMessages = [
    "well, u can't say no.",
    "i think u misclicked 🤨",
    "r u sure baby? 😢",
  ];

  const getNoMessage = () => noMessages[noClickCount % noMessages.length];

  if (response === "yes") {
    return <GiftPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <img src="/us.jpg" alt="us!" className="w-128 h-64 mb-4 rounded-lg shadow-lg" />
      <h1 className="text-3xl font-serif max-w-lg">will you be my valentine? 💖</h1>
      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setResponse("yes")}
          className="font-serif px-6 py-3 bg-pink-400 text-white rounded-full text-lg shadow-lg hover:bg-green-600"
        >
          yes!
        </button>
        <div className="relative">
          <button
            onClick={() => setNoClickCount(noClickCount + 1)}
            className="font-serif px-6 py-3 bg-green-400 text-black rounded-full text-lg shadow-lg hover:bg-pink-600"
          >
            no
          </button>
          {noClickCount > 0 && (
            <div className="absolute -top-50 left-1/2 transform -translate-x-1/2 bg-green-800 text-gray-300 px-3 py-1 rounded-lg shadow-lg whitespace-nowrap">
              {getNoMessage()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Page 2 - Gift Page with Heart Jump Game
function GiftPage() {
  const [isGameStarted, setIsGameStarted] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      {/* Only show this section if game hasn't started */}
      {!isGameStarted && (
        <>
          <img src="/berjaya.jpg" alt="she said yes!" className="w-128 h-64 mb-4 rounded-lg shadow-lg" />
          <h1 className="text-3xl font-bold font-serif max-w-lg">can't wait for our special date! ❤️</h1>
          <p className="text-lg mt-2 font-serif max-w-xl">from afif, here's a little gift for you :p</p>
        </>
      )}

      {/* Start button is shown before game starts */}
      {!isGameStarted && (
        <button
          onClick={() => setIsGameStarted(true)}
          className="font-serif mt-6 px-6 py-3 bg-green-400 text-white rounded-full text-lg shadow-lg hover:bg-pink-400"
        >
          proceed to gift
        </button>
      )}

      {/* Game shows only when started */}
      {isGameStarted && <HeartJumpGame />}
    </div>
  );
}

// Page 3 - Mini Game: Heart Jump (Like Chrome Dino)
function HeartJumpGame() {
  const canvasRef = useRef(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let heart = { x: 50, y: 130, width: 20, height: 20, dy: 0, gravity: 0.45, jump: -7 };
    let obstacles = [];
    let gameSpeed = 3;
    let gameActive = true;

    function setBackground() {
      const bgImage = new Image();
      bgImage.src = "/spongebob.jpg"; // Replace with the correct path to your image
    
      bgImage.onload = function () {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      };
    }

    function drawHeart() {
      ctx.fillStyle = "red";
      ctx.font = "20px sans-serif";
      ctx.fillText("❤️", heart.x, heart.y);
    }

    function drawObstacles() {
      ctx.font = "20px sans-serif";
      obstacles.forEach((obs) => {
        ctx.fillText(obs.emoji, obs.x, obs.y);
      });
    }

    const obstacleEmojis = ["😺", "💋", "🍫", "😈","🐤", "🌞", "💐", "🍓"]; // List of emojis to use as obstacles

    function updateObstacles() {
      obstacles.forEach((obs) => {
        obs.x -= gameSpeed;
      });

      // Remove obstacles that go off-screen and update score
      if (obstacles.length > 0 && obstacles[0].x + 20 < 0) {
        obstacles.shift();
        setScore((prev) => prev + 1);
      }

      // Ensure proper spacing before spawning a new obstacle
      if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < 200) {
        if (Math.random() < 0.02) { 
          const randomEmoji = obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)];
          obstacles.push({ x: 300, y: 140, width: 20, height: 20, emoji: randomEmoji });
        }
      }
    }     

    function jump() {
      if (heart.y >= 130) heart.dy = heart.jump;
    }

    function gameLoop() {
      if (!gameActive) return;

      setBackground();
      drawHeart();
      drawObstacles();

      heart.dy += heart.gravity;
      heart.y += heart.dy;
      if (heart.y > 130) {
        heart.y = 130;
        heart.dy = 0;
      }

      updateObstacles();

      obstacles.forEach((obs) => {
        if (
          heart.x < obs.x + obs.width &&
          heart.x + heart.width > obs.x &&
          heart.y < obs.y + obs.height &&
          heart.y + heart.height > obs.y
        ) {
          setIsGameOver(true);
          gameActive = false;
        }
      });

      requestAnimationFrame(gameLoop);
    }

    gameLoop();

    // Event listener for mouse or touch to make the heart jump
    const handleJump = (e) => {
      // Prevent default behavior for touch
      if (e.type === "touchstart") e.preventDefault();
      jump();
    };

    window.addEventListener("click", handleJump);
    window.addEventListener("touchstart", handleJump);

    return () => {
      window.removeEventListener("click", handleJump);
      window.removeEventListener("touchstart", handleJump);
    };
  }, [gameStarted]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center min-h-screen">
      {/* Container for buttons */}
      <div className="mb-4">
        {!gameStarted && (
          <button
            onClick={() => {
              setGameStarted(true);
              setIsGameOver(false);
              setScore(0);
            }}
            className="font-serif mt-4 px-6 py-3 bg-green-400 text-white rounded-full text-lg shadow-lg hover:bg-pink-400"
          >
            press me to start!
          </button>
        )}
        {isGameOver && (
          <button
            onClick={() => {
              setIsGameOver(false);
              setScore(0);
              setGameStarted(false);
            }}
            className="font-serif mt-4 px-6 py-3 bg-pink-400 text-white rounded-full text-lg shadow-lg hover:bg-green-400"
          >
            restart :p
          </button>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="border-2 border-pink-500 rounded-lg shadow-xl"
      ></canvas>

      <p className="mt-2 font-serif">how much sarr love afif: {score}</p>
    </div>
  );
}
