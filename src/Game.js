import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Game() {
  const canvasRef = useRef(null);
  const ballsRef = useRef([]);
  const playerRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    radius: 10,
    color: "black",
    speedMultiplier: 1,
  });
  const scoreRef = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colors = ["red", "gold", "green", "orange", "purple", "silver", "teal"];
    const safeDistance = 50;

    const createRandomBall = () => {
      let x, y, radius;
      radius = 5 + Math.random() * 20;
      do {
        x = Math.random() * window.innerWidth;
        y = Math.random() * window.innerHeight;
      } while (
        Math.sqrt((x - playerRef.current.x) ** 2 + (y - playerRef.current.y) ** 2) <
        playerRef.current.radius + radius + safeDistance
      );
      return {
        x,
        y,
        radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
      };
    };

    const balls = [];
    for (let i = 0; i < 50; i++) balls.push(createRandomBall());
    ballsRef.current = balls;

    let targetX = playerRef.current.x;
    let targetY = playerRef.current.y;

    const movePlayer = (x, y) => {
      if (!gameOver) {
        targetX = x;
        targetY = y;
      }
    };
    const handleTouch = (e) => movePlayer(e.touches[0].clientX, e.touches[0].clientY);
    const handleMouse = (e) => movePlayer(e.clientX, e.clientY);

    canvas.addEventListener("touchmove", handleTouch, { passive: false });
    canvas.addEventListener("mousemove", handleMouse);

    let animationId;

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.fillStyle = "ivory";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const dx = targetX - playerRef.current.x;
      const dy = targetY - playerRef.current.y;
      playerRef.current.x += dx * 0.1 * playerRef.current.speedMultiplier;
      playerRef.current.y += dy * 0.1 * playerRef.current.speedMultiplier;

      ballsRef.current.forEach((ball, index) => {
        ball.x += ball.dx;
        ball.y += ball.dy;
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > window.innerWidth) ball.dx *= -1;
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > window.innerHeight) ball.dy *= -1;

        const distX = playerRef.current.x - ball.x;
        const distY = playerRef.current.y - ball.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < playerRef.current.radius + ball.radius) {
          if (playerRef.current.radius >= ball.radius) {
            playerRef.current.radius += ball.radius * 0.001;
            playerRef.current.speedMultiplier += 0.01;
            ballsRef.current.splice(index, 1);
            ballsRef.current.push(createRandomBall());
            scoreRef.current += 1;
          } else {
            setGameOver(true);
          }
        }

        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = playerRef.current.color;
      ctx.beginPath();
      ctx.arc(playerRef.current.x, playerRef.current.y, playerRef.current.radius, 0, Math.PI * 2);
      ctx.fill();

      // Glassy scoreboard
      const padding = 15;
      const scoreText = `Score: ${scoreRef.current}`;
      ctx.font = "24px Arial";
      const textWidth = ctx.measureText(scoreText).width;
      const textHeight = 24;

      const rectX = 20 - padding;
      const rectY = 20 - textHeight + 5 - padding;
      const rectWidth = textWidth + padding * 2;
      const rectHeight = textHeight + padding * 2;

      ctx.beginPath();
      ctx.moveTo(rectX + 10, rectY);
      ctx.lineTo(rectX + rectWidth - 10, rectY);
      ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + 10);
      ctx.lineTo(rectX + rectWidth, rectY + rectHeight - 10);
      ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - 10, rectY + rectHeight);
      ctx.lineTo(rectX + 10, rectY + rectHeight);
      ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - 10);
      ctx.lineTo(rectX, rectY + 10);
      ctx.quadraticCurveTo(rectX, rectY, rectX + 10, rectY);
      ctx.closePath();

      ctx.fillStyle = "rgba(31, 93, 104, 0.53)";
      ctx.fill();
      ctx.strokeStyle = "rgba(13, 81, 112, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.fillText(scoreText, 20, 30);

      if (gameOver) {
        // Navigate to scoreboard after short delay
        setTimeout(() => {
          navigate("/scoreboard", { state: { score: scoreRef.current } });
        }, 500);
      } else {
        animationId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("touchmove", handleTouch);
      canvas.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animationId);
    };
  }, [gameOver, navigate]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}
