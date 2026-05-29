"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TEST_DURATION_MS = 30_000;
const COUNTDOWN_SECONDS = 3;
const TARGET_RADIUS = 18;
const CROSSHAIR_RADIUS = 7;

type TestPhase = "idle" | "countdown" | "running" | "paused" | "complete";

type Point = {
  x: number;
  y: number;
};

type FrameSample = {
  elapsedMs: number;
  target: Point;
  crosshair: Point;
  aimOffset: Point;
  distance: number;
};

type TrackingMetrics = {
  durationMs: number;
  accuracy: number;
  averageDistancePx: number;
  smoothness: number;
  shakiness: number;
  estimatedLagMs: number;
  correctionFrequency: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getViewportCenter(width: number, height: number): Point {
  return {
    x: width / 2,
    y: height / 2,
  };
}

function getTargetWorldPosition(elapsedMs: number, width: number, height: number): Point {
  const t = elapsedMs / 1000;
  const safeWidth = Math.max(width - TARGET_RADIUS * 4, 120);
  const safeHeight = Math.max(height - TARGET_RADIUS * 8, 90);

  return {
    x:
      width / 2 +
      Math.sin(t * 1.45) * safeWidth * 0.32 +
      Math.sin(t * 2.75 + 1.4) * safeWidth * 0.12,
    y:
      height / 2 +
      Math.sin(t * 1.1 + 0.75) * safeHeight * 0.24 +
      Math.sin(t * 2.05) * safeHeight * 0.08,
  };
}

function getTargetScreenPosition(
  elapsedMs: number,
  width: number,
  height: number,
  aimOffset: Point,
): Point {
  const targetWorld = getTargetWorldPosition(elapsedMs, width, height);

  return {
    x: targetWorld.x - aimOffset.x,
    y: targetWorld.y - aimOffset.y,
  };
}

function calculateMetrics(samples: FrameSample[]): TrackingMetrics {
  if (samples.length < 2) {
    return {
      durationMs: TEST_DURATION_MS,
      accuracy: 0,
      averageDistancePx: 0,
      smoothness: 0,
      shakiness: 0,
      estimatedLagMs: 0,
      correctionFrequency: 0,
    };
  }

  const totalDistance = samples.reduce((sum, sample) => sum + sample.distance, 0);
  const framesInsideTarget = samples.filter(
    (sample) => sample.distance <= TARGET_RADIUS,
  ).length;
  const averageDistancePx = totalDistance / samples.length;
  const accuracy = framesInsideTarget / samples.length;

  const velocities = samples.slice(1).map((sample, index) => {
    const previous = samples[index];
    const dt = Math.max((sample.elapsedMs - previous.elapsedMs) / 1000, 0.001);
    return {
      x: (sample.aimOffset.x - previous.aimOffset.x) / dt,
      y: (sample.aimOffset.y - previous.aimOffset.y) / dt,
    };
  });

  const acceleration = velocities.slice(1).map((velocity, index) => {
    const previous = velocities[index];
    return Math.hypot(velocity.x - previous.x, velocity.y - previous.y);
  });

  const averageAcceleration =
    acceleration.reduce((sum, value) => sum + value, 0) / Math.max(acceleration.length, 1);
  const smoothness = clamp(1 - averageAcceleration / 8000, 0, 1);

  const nearTargetVelocities = velocities.filter((_, index) => {
    const sample = samples[index + 1];
    return sample.distance <= TARGET_RADIUS * 2.4;
  });
  const nearTargetSpeed =
    nearTargetVelocities.reduce((sum, velocity) => sum + Math.hypot(velocity.x, velocity.y), 0) /
    Math.max(nearTargetVelocities.length, 1);
  const shakiness = clamp(nearTargetSpeed / 900, 0, 1);

  let correctionCount = 0;
  let previousErrorX = samples[0].target.x - samples[0].crosshair.x;
  let previousErrorY = samples[0].target.y - samples[0].crosshair.y;
  for (const sample of samples.slice(1)) {
    const errorX = sample.target.x - sample.crosshair.x;
    const errorY = sample.target.y - sample.crosshair.y;
    if (Math.sign(errorX) !== Math.sign(previousErrorX) && Math.abs(errorX) > 4) {
      correctionCount += 1;
    }
    if (Math.sign(errorY) !== Math.sign(previousErrorY) && Math.abs(errorY) > 4) {
      correctionCount += 1;
    }
    previousErrorX = errorX;
    previousErrorY = errorY;
  }

  const durationSeconds = TEST_DURATION_MS / 1000;
  const correctionFrequency = correctionCount / durationSeconds;
  const estimatedLagMs = clamp((averageDistancePx / 240) * 1000, 0, 300);

  return {
    durationMs: TEST_DURATION_MS,
    accuracy: Number(accuracy.toFixed(3)),
    averageDistancePx: Number(averageDistancePx.toFixed(1)),
    smoothness: Number(smoothness.toFixed(3)),
    shakiness: Number(shakiness.toFixed(3)),
    estimatedLagMs: Math.round(estimatedLagMs),
    correctionFrequency: Number(correctionFrequency.toFixed(2)),
  };
}

function drawScene(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  target: Point,
) {
  const crosshair = getViewportCenter(width, height);

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);

  context.beginPath();
  context.arc(target.x, target.y, TARGET_RADIUS, 0, Math.PI * 2);
  context.fillStyle = "#fb3f7f";
  context.shadowColor = "#fb3f7f";
  context.shadowBlur = 18;
  context.fill();
  context.shadowBlur = 0;
  context.lineWidth = 2;
  context.strokeStyle = "#ffd1df";
  context.stroke();

  context.beginPath();
  context.arc(crosshair.x, crosshair.y, CROSSHAIR_RADIUS, 0, Math.PI * 2);
  context.strokeStyle = "#35f5d0";
  context.lineWidth = 2;
  context.stroke();

  context.beginPath();
  context.moveTo(crosshair.x - 14, crosshair.y);
  context.lineTo(crosshair.x - 4, crosshair.y);
  context.moveTo(crosshair.x + 4, crosshair.y);
  context.lineTo(crosshair.x + 14, crosshair.y);
  context.moveTo(crosshair.x, crosshair.y - 14);
  context.lineTo(crosshair.x, crosshair.y - 4);
  context.moveTo(crosshair.x, crosshair.y + 4);
  context.lineTo(crosshair.x, crosshair.y + 14);
  context.stroke();
}

export default function TrackingTest() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const runFrameRef = useRef<(timestamp: number) => void>(() => {});
  const runCountdownFrameRef = useRef<(timestamp: number) => void>(() => {});
  const samplesRef = useRef<FrameSample[]>([]);
  const aimOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const startTimeRef = useRef<number>(0);
  const targetStartTimeRef = useRef<number>(0);
  const elapsedBeforePauseRef = useRef<number>(0);
  const phaseRef = useRef<TestPhase>("idle");
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [timeLeftMs, setTimeLeftMs] = useState(TEST_DURATION_MS);
  const [metrics, setMetrics] = useState<TrackingMetrics | null>(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  const displayTime = useMemo(() => {
    if (phase === "countdown") {
      return `${countdown}s`;
    }

    return `${Math.ceil(timeLeftMs / 1000)}s`;
  }, [countdown, phase, timeLeftMs]);

  const pointerStatusText = useMemo(() => {
    if (isPointerLocked) {
      return "Pointer locked";
    }

    if (phase === "paused") {
      return "Paused";
    }

    return "Click start to lock pointer";
  }, [isPointerLocked, phase]);

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const resetAim = useCallback(() => {
    aimOffsetRef.current = { x: 0, y: 0 };
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * pixelRatio);
    canvas.height = Math.round(rect.height * pixelRatio);
    const context = canvas.getContext("2d");
    if (context) {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawScene(
        context,
        rect.width,
        rect.height,
        getViewportCenter(rect.width, rect.height),
      );
    }
  }, []);

  const finishTest = useCallback((shouldExitPointerLock = true) => {
    stopAnimation();
    elapsedBeforePauseRef.current = TEST_DURATION_MS;
    phaseRef.current = "complete";
    setPhase("complete");
    setTimeLeftMs(0);
    setMetrics(calculateMetrics(samplesRef.current));

    if (shouldExitPointerLock && document.pointerLockElement === canvasRef.current) {
      document.exitPointerLock();
    }
  }, [stopAnimation]);

  const pauseTest = useCallback(() => {
    stopAnimation();

    const elapsedMs = clamp(
      elapsedBeforePauseRef.current + performance.now() - startTimeRef.current,
      0,
      TEST_DURATION_MS,
    );

    elapsedBeforePauseRef.current = elapsedMs;
    phaseRef.current = "paused";
    setPhase("paused");
    setTimeLeftMs(Math.max(TEST_DURATION_MS - elapsedMs, 0));
  }, [stopAnimation]);

  const runCountdownFrame = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || phaseRef.current !== "countdown") {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const target = getTargetScreenPosition(
      timestamp - targetStartTimeRef.current,
      rect.width,
      rect.height,
      aimOffsetRef.current,
    );

    drawScene(context, rect.width, rect.height, target);

    animationFrameRef.current = requestAnimationFrame((nextTimestamp) => {
      runCountdownFrameRef.current(nextTimestamp);
    });
  }, []);

  const beginCountdown = useCallback(() => {
    stopAnimation();
    setCountdown(COUNTDOWN_SECONDS);
    phaseRef.current = "countdown";
    setPhase("countdown");
    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      runCountdownFrameRef.current(timestamp);
    });
  }, [stopAnimation]);

  const runFrame = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const elapsedMs = elapsedBeforePauseRef.current + timestamp - startTimeRef.current;
      const remainingMs = Math.max(TEST_DURATION_MS - elapsedMs, 0);
      const target = getTargetScreenPosition(
        timestamp - targetStartTimeRef.current,
        rect.width,
        rect.height,
        aimOffsetRef.current,
      );
      const crosshair = getViewportCenter(rect.width, rect.height);
      const currentDistance = distance(target, crosshair);

      samplesRef.current.push({
        elapsedMs,
        target,
        crosshair,
        aimOffset: { ...aimOffsetRef.current },
        distance: currentDistance,
      });

      setTimeLeftMs(remainingMs);
      drawScene(context, rect.width, rect.height, target);

      if (elapsedMs >= TEST_DURATION_MS) {
        finishTest();
        return;
      }

      animationFrameRef.current = requestAnimationFrame((nextTimestamp) => {
        runFrameRef.current(nextTimestamp);
      });
    },
    [finishTest],
  );

  const beginRunning = useCallback(() => {
    stopAnimation();
    phaseRef.current = "running";
    setPhase("running");
    setTimeLeftMs(Math.max(TEST_DURATION_MS - elapsedBeforePauseRef.current, 0));
    startTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      runFrameRef.current(timestamp);
    });
  }, [stopAnimation]);

  const resumeTest = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    try {
      await canvas.requestPointerLock();
      beginCountdown();
    } catch {
      setIsPointerLocked(false);
      phaseRef.current = "paused";
      setPhase("paused");
    }
  }, [beginCountdown]);

  useEffect(() => {
    runFrameRef.current = runFrame;
  }, [runFrame]);

  useEffect(() => {
    runCountdownFrameRef.current = runCountdownFrame;
  }, [runCountdownFrame]);

  const startTest = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    stopAnimation();
    samplesRef.current = [];
    resetAim();
    setMetrics(null);
    setCountdown(COUNTDOWN_SECONDS);
    setTimeLeftMs(TEST_DURATION_MS);
    elapsedBeforePauseRef.current = 0;
    targetStartTimeRef.current = performance.now();

    try {
      await canvas.requestPointerLock();
      beginCountdown();
    } catch {
      setIsPointerLocked(false);
      phaseRef.current = "idle";
      setPhase("idle");
    }
  }, [beginCountdown, resetAim, stopAnimation]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      stopAnimation();
    };
  }, [resizeCanvas, stopAnimation]);

  useEffect(() => {
    if (phase !== "countdown") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (countdown <= 1) {
        setCountdown(0);
        beginRunning();
        return;
      }

      setCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [beginRunning, countdown, phase]);

  useEffect(() => {
    const handlePointerLockChange = () => {
      const hasPointerLock = document.pointerLockElement === canvasRef.current;
      setIsPointerLocked(hasPointerLock);

      if (hasPointerLock) {
        return;
      }

      if (phaseRef.current === "running") {
        pauseTest();
        return;
      }

      if (phaseRef.current === "countdown") {
        stopAnimation();
        if (elapsedBeforePauseRef.current > 0 || samplesRef.current.length > 0) {
          phaseRef.current = "paused";
          setPhase("paused");
          setCountdown(COUNTDOWN_SECONDS);
          setTimeLeftMs(Math.max(TEST_DURATION_MS - elapsedBeforePauseRef.current, 0));
          return;
        }

        phaseRef.current = "idle";
        setPhase("idle");
        setCountdown(COUNTDOWN_SECONDS);
        setTimeLeftMs(TEST_DURATION_MS);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      const canMoveAim = phaseRef.current === "countdown" || phaseRef.current === "running";
      if (!canMoveAim || document.pointerLockElement !== canvas || !canvas) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const maxOffsetX = rect.width * 0.65;
      const maxOffsetY = rect.height * 0.65;

      aimOffsetRef.current = {
        x: clamp(aimOffsetRef.current.x + event.movementX, -maxOffsetX, maxOffsetX),
        y: clamp(aimOffsetRef.current.y + event.movementY, -maxOffsetY, maxOffsetY),
      };
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [pauseTest, stopAnimation]);

  const handlePrimaryAction = useCallback(() => {
    if (phase === "paused") {
      void resumeTest();
      return;
    }

    void startTest();
  }, [phase, resumeTest, startTest]);

  return (
    <main className="h-screen overflow-hidden bg-black text-zinc-100">
      <section className="relative flex h-full flex-col">
        <div className="absolute left-0 right-0 top-0 z-10 flex items-start justify-between gap-4 p-4 text-sm text-zinc-300 sm:p-6">
          <div>
            <p className="font-semibold uppercase text-zinc-500">Mouse Fit Diagnostic</p>
            <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              Tracking Test
            </h1>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl text-white">{displayTime}</p>
            <p className={isPointerLocked ? "text-emerald-300" : "text-amber-300"}>
              {pointerStatusText}
            </p>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-none bg-black"
          aria-label="Tracking test arena"
        />

        {phase === "countdown" && (
          <div className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2 px-6 text-center">
            <p className="font-mono text-lg font-semibold uppercase text-white sm:text-xl">
              Get ready in {countdown}s
            </p>
          </div>
        )}

        {phase !== "running" && phase !== "countdown" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-6">
            <div className="w-full max-w-md border border-zinc-800 bg-black p-6 text-center shadow-2xl">
              <p className="text-sm uppercase text-zinc-500">
                {phase === "paused" ? "Paused" : "30 seconds"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Keep the target in the center crosshair.
              </h2>
              <p className="mt-4 leading-7 text-zinc-400">
                Black background, one target, no clicking. Move naturally and track as
                smoothly as possible.
              </p>
              <button
                className="mt-6 w-full border border-emerald-400 bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:bg-emerald-300"
                type="button"
                onClick={handlePrimaryAction}
              >
                {phase === "paused"
                  ? "Continue"
                  : phase === "complete"
                    ? "Run again"
                    : "Start tracking"}
              </button>
            </div>
          </div>
        )}

        {metrics && (
          <aside className="absolute bottom-4 left-4 right-4 z-30 grid gap-3 border border-zinc-800 bg-black/90 p-4 text-sm text-zinc-300 sm:left-auto sm:w-[420px] sm:grid-cols-2">
            <Metric label="Accuracy" value={`${Math.round(metrics.accuracy * 100)}%`} />
            <Metric label="Avg distance" value={`${metrics.averageDistancePx}px`} />
            <Metric label="Smoothness" value={`${Math.round(metrics.smoothness * 100)}%`} />
            <Metric label="Shakiness" value={`${Math.round(metrics.shakiness * 100)}%`} />
            <Metric label="Est. lag" value={`${metrics.estimatedLagMs}ms`} />
            <Metric label="Corrections/s" value={`${metrics.correctionFrequency}`} />
          </aside>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-900 bg-zinc-950 px-3 py-2">
      <span className="block text-xs uppercase text-zinc-500">{label}</span>
      <strong className="mt-1 block font-mono text-lg text-white">{value}</strong>
    </div>
  );
}
