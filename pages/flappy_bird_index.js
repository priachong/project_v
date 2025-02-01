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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <img src="/berjaya.jpg" alt="she said yes!" className="w-128 h-64 mb-4 rounded-lg shadow-lg" />
      <h1 className="text-3xl font-bold font-serif max-w-lg">can't wait for our special date! ❤️</h1>
      <p className="text-lg mt-2 font-serif max-w-xl">from afif, here's a little gift for you :p</p>
      <FlappyHeartGame />
    </div>
  );
}

// Page 3 - Mini Game: Heart Jump (Like Chrome Dino)

function FlappyHeartGame() {
  const canvasRef = useRef(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const heart = { x: 50, y: 130, width: 20, height: 20, dy: 0, gravity: 0.5, jump: -7 };
    const pipes = [];
    const pipeWidth = 50;
    const pipeGap = 90; // Vertical gap between pipes
    const pipeSpacing = 200; // Horizontal spacing between pipes
    let gameSpeed = 2.5;
    let gameActive = true;

    function setBackground() {
      ctx.fillStyle = "#e0a8e6"; // Light purple background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawHeart() {
      ctx.fillStyle = "red";
      ctx.font = "20px sans-serif";
      ctx.fillText("❤️", heart.x, heart.y);
    }

    function drawPipes() {
      ctx.fillStyle = "#3e9c43"; // Green pipes
      pipes.forEach((pipe) => ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height));
    }

    function updatePipes() {
      pipes.forEach((pipe) => {
        pipe.x -= gameSpeed;
      });

      if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - pipeSpacing) {
        let lastPipeX = pipes.length > 0 ? pipes[pipes.length - 1].x : canvas.width;
        let pipeHeight = Math.random() * (canvas.height - pipeGap - 50) + 50; // Controlled random height

        pipes.push(
          { x: lastPipeX + pipeSpacing, y: 0, width: pipeWidth, height: pipeHeight }, // Top pipe
          { x: lastPipeX + pipeSpacing, y: pipeHeight + pipeGap, width: pipeWidth, height: canvas.height - pipeHeight - pipeGap } // Bottom pipe
        );
      }

      if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        pipes.shift();
        setScore((prev) => prev + 1);
      }
    }

    function jump() {
      heart.dy = heart.jump;
    }

    function gameLoop() {
      if (!gameActive) return;

      setBackground();
      drawHeart();
      drawPipes();

      heart.dy += heart.gravity;
      heart.y += heart.dy;
      if (heart.y > canvas.height - 20) {
        heart.y = canvas.height - 20;
        heart.dy = 0;
      }
      if (heart.y < 0) heart.y = 0;

      updatePipes();

      pipes.forEach((pipe) => {
        if (
          heart.x < pipe.x + pipe.width &&
          heart.x + heart.width > pipe.x &&
          heart.y < pipe.y + pipe.height &&
          heart.y + heart.height > pipe.y
        ) {
          setIsGameOver(true);
          gameActive = false;
        }
      });

      requestAnimationFrame(gameLoop);
    }

    gameLoop();

    window.addEventListener("keydown", jump);
    canvas.addEventListener("click", jump); // Enable touchscreen support

    return () => {
      window.removeEventListener("keydown", jump);
      canvas.removeEventListener("click", jump);
    };
  }, [gameStarted]);

  return (
    <div className="flex flex-col items-center mt-4 relative">
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
            Press to Start!
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
            Restart :p
          </button>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="border-2 border-pink-500 rounded-lg shadow-xl"
      ></canvas>

      <p className="mt-2 font-serif">How much Sarr loves Afif: {score}</p>
    </div>
  );
}
