import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function FooterMiniGame() {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try {
      return Number(window.localStorage.getItem('ak-minigame-best') || 0);
    } catch {
      return 0;
    }
  });

  const gameRef = useRef({
    playerY: 74,
    vy: 0,
    grounded: true,
    obstacles: [],
    speed: 3.1,
    score: 0,
    spawnTimer: 45,
  });

  const jump = () => {
    if (status !== 'playing') {
      gameRef.current = {
        playerY: 74,
        vy: 0,
        grounded: true,
        obstacles: [],
        speed: 3.1,
        score: 0,
        spawnTimer: 40,
      };
      setScore(0);
      setStatus('playing');
      return;
    }

    if (gameRef.current.grounded) {
      gameRef.current.vy = -6.8;
      gameRef.current.grounded = false;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const W = 280;
    const H = 104;
    const groundY = 88;
    const playerX = 34;
    const playerSize = 14;

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(W, groundY);
      ctx.stroke();

      ctx.fillStyle = '#B8FF2E';
      ctx.fillRect(playerX, groundY - playerSize, playerSize, playerSize);
    };

    if (status !== 'playing') {
      drawStatic();
      return undefined;
    }

    let rafId = 0;

    const loop = () => {
      const g = gameRef.current;

      // Physics
      g.vy += 0.36;
      g.playerY += g.vy;
      if (g.playerY >= groundY - playerSize) {
        g.playerY = groundY - playerSize;
        g.vy = 0;
        g.grounded = true;
      }

      // Spawn bug obstacles
      g.spawnTimer -= 1;
      if (g.spawnTimer <= 0) {
        const h = 12 + Math.floor(Math.random() * 12);
        g.obstacles.push({ x: W + 10, w: 12, h });
        g.spawnTimer = 46 + Math.floor(Math.random() * 34);
      }

      g.speed = Math.min(5.8, g.speed + 0.0012);
      g.score += 1;
      if (g.score % 5 === 0) {
        setScore(Math.floor(g.score / 5));
      }

      // Draw
      ctx.clearRect(0, 0, W, H);

      // Ground
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(W, groundY);
      ctx.stroke();

      // Player
      ctx.fillStyle = '#B8FF2E';
      ctx.fillRect(playerX, g.playerY, playerSize, playerSize);

      // Obstacles & collision
      for (let i = g.obstacles.length - 1; i >= 0; i -= 1) {
        const ob = g.obstacles[i];
        ob.x -= g.speed;

        ctx.fillStyle = '#FF4D6D';
        ctx.fillRect(ob.x, groundY - ob.h, ob.w, ob.h);

        const hit =
          playerX < ob.x + ob.w - 2 &&
          playerX + playerSize - 2 > ob.x &&
          g.playerY + playerSize - 2 > groundY - ob.h;

        if (hit) {
          const finalScore = Math.floor(g.score / 5);
          setScore(finalScore);
          setBest((prev) => {
            const nextBest = Math.max(prev, finalScore);
            try {
              window.localStorage.setItem('ak-minigame-best', String(nextBest));
            } catch {
              // ignore
            }
            return nextBest;
          });
          setStatus('gameover');
          return;
        }

        if (ob.x + ob.w < 0) {
          g.obstacles.splice(i, 1);
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [status]);

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-3.5 backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between gap-4 font-mono text-xs tracking-wider uppercase">
        <span className="text-[var(--accent-neon)]">Bug Dodge</span>
        <span className="tabular-nums text-[var(--text-secondary)]">
          {score} · Best {best}
        </span>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={jump}
        onKeyDown={(e) => {
          if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            jump();
          }
        }}
        aria-label={
          status === 'gameover'
            ? 'Bug Hit! Tap to Retry'
            : reducedMotion
              ? 'Tap to Play'
              : 'Tap or Space to Jump'
        }
        className="relative cursor-pointer overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[#06070B]/80 focus-visible:outline-2 focus-visible:outline-[var(--accent-neon)]"
      >
        <canvas ref={canvasRef} width={280} height={104} className="block h-[104px] w-full max-w-[280px]" />

        {status !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 text-center">
            <span className="font-mono text-[11px] font-semibold tracking-widest uppercase text-[#F4F6FB]">
              {status === 'gameover' ? 'Bug Hit! Tap to Retry' : reducedMotion ? 'Tap to Play' : 'Tap or Space to Jump'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

