"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DiagnosticProfileControls } from "../diagnostic-profile-controls";
import { setDiagnosticComplete } from "../diagnostic-progress";
import {
  type AngularTarget,
  type CameraAim,
  type Point,
  DEFAULT_CAMERA_AIM,
  applyMouseMovementToCamera,
  clamp,
  distance,
  projectAngularTarget,
  randomInRange,
  requestRawPointerLock,
} from "../fps-camera";
import { getStoredMouseRadiansPerCount } from "../profile-draft";

const TEST_DURATION_MS = 30_000;
const COUNTDOWN_SECONDS = 3;
const TARGET_RADIUS = 18;
const CURSOR_RADIUS = 5;
const TRAIL_LIMIT = 90;

type TestPhase = "idle" | "countdown" | "running" | "paused" | "complete";


type Target = AngularTarget;

type MicroAdjustmentResult = {
  hit: number;
  overCorrection: number;
  underCorrection: number;
};

type MicroAttempt = {
  wasHit: boolean;
  timeToClickMs: number;
  missDistancePx: number;
  startDistancePx: number;
  finalDistancePx: number;
  closestDistancePx: number;
};

type MicroMetrics = {
  hits: number;
  misses: number;
  accuracy: number;
  averageTimeToClickMs: number;
  averageMissDistancePx: number;
  averageStartDistancePx: number;
  overCorrectionRate: number;
  underCorrectionRate: number;
  fineControlScore: number;
};


function generateMicroTarget(): Target {
  const angle = Math.random() * Math.PI * 2;
  const targetDistance = randomInRange(0.045, 0.145);

  return {
    yaw: Math.cos(angle) * targetDistance,
    pitch: Math.sin(angle) * targetDistance,
  };
}

function getTargetScreenPosition(
  target: Target,
  cameraAim: CameraAim,
  width: number,
  height: number,
): Point {
  return projectAngularTarget(target, cameraAim, width, height);
}

function getCursorScreenPosition(cameraAim: CameraAim, width: number, height: number): Point {
  return projectAngularTarget(cameraAim, DEFAULT_CAMERA_AIM, width, height);
}

function pushTrailPoint(trail: Point[], point: Point) {
  trail.push(point);

  if (trail.length > TRAIL_LIMIT) {
    trail.shift();
  }
}


function getMicroAdjustmentResult(
  finalDistancePx: number,
  closestDistancePx: number,
  targetRadiusPx: number,
): MicroAdjustmentResult {
  if (finalDistancePx <= targetRadiusPx) {
    return {
      hit: 1,
      overCorrection: 0,
      underCorrection: 0,
    };
  }

  const reachedTargetZone = closestDistancePx <= targetRadiusPx * 1.25;
  const driftedAwayAfterCorrection =
    finalDistancePx > closestDistancePx + targetRadiusPx * 0.75;

  if (reachedTargetZone && driftedAwayAfterCorrection) {
    return {
      hit: 0,
      overCorrection: 1,
      underCorrection: 0,
    };
  }

  return {
    hit: 0,
    overCorrection: 0,
    underCorrection: 1,
  };
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateFineControlScore(
  accuracy: number,
  averageMissDistancePx: number,
  overCorrectionRate: number,
  underCorrectionRate: number,
) {
  const missPrecision = clamp(1 - averageMissDistancePx / (TARGET_RADIUS * 3), 0, 1);
  const correctionPenalty = overCorrectionRate * 0.25 + underCorrectionRate * 0.15;

  return clamp(accuracy * 0.7 + missPrecision * 0.3 - correctionPenalty, 0, 1);
}

function calculateMetrics(
  attempts: MicroAttempt[],
  overCorrections: number,
  underCorrections: number,
): MicroMetrics {
  const hits = attempts.filter((attempt) => attempt.wasHit).length;
  const misses = attempts.length - hits;
  const missAttempts = attempts.filter((attempt) => !attempt.wasHit);
  const accuracy = attempts.length === 0 ? 0 : hits / attempts.length;
  const averageMissDistancePx = average(
    missAttempts.map((attempt) => attempt.missDistancePx),
  );
  const overCorrectionRate = misses === 0 ? 0 : overCorrections / misses;
  const underCorrectionRate = misses === 0 ? 0 : underCorrections / misses;

  return {
    hits,
    misses,
    accuracy: Number(accuracy.toFixed(3)),
    averageTimeToClickMs: Math.round(
      average(attempts.map((attempt) => attempt.timeToClickMs)),
    ),
    averageMissDistancePx: Number(averageMissDistancePx.toFixed(1)),
    averageStartDistancePx: Number(
      average(attempts.map((attempt) => attempt.startDistancePx)).toFixed(1),
    ),
    overCorrectionRate: Number(overCorrectionRate.toFixed(3)),
    underCorrectionRate: Number(underCorrectionRate.toFixed(3)),
    fineControlScore: Number(
      calculateFineControlScore(
        accuracy,
        averageMissDistancePx,
        overCorrectionRate,
        underCorrectionRate,
      ).toFixed(3),
    ),
  };
}

function drawScene(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  finish: Point | null,
  cursor: Point,
  trail: Point[],
) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);

  const start = {
    x: width / 2,
    y: height / 2,
  };

  context.beginPath();
  context.arc(start.x, start.y, 7, 0, Math.PI * 2);
  context.strokeStyle = "rgba(53, 245, 208, 0.42)";
  context.lineWidth = 2;
  context.stroke();

  if (finish) {
    context.beginPath();
    context.arc(finish.x, finish.y, TARGET_RADIUS, 0, Math.PI * 2);
    context.strokeStyle = "#f9d84a";
    context.lineWidth = 2;
    context.stroke();

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(finish.x, finish.y);
    context.strokeStyle = "rgba(249, 216, 74, 0.2)";
    context.lineWidth = 1;
    context.stroke();
  }

  if (trail.length > 1) {
    context.beginPath();
    trail.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.strokeStyle = "rgba(53, 245, 208, 0.76)";
    context.lineWidth = 2;
    context.stroke();
  }

  context.beginPath();
  context.arc(cursor.x, cursor.y, CURSOR_RADIUS, 0, Math.PI * 2);
  context.fillStyle = "#35f5d0";
  context.shadowColor = "#35f5d0";
  context.shadowBlur = 12;
  context.fill();
  context.shadowBlur = 0;
}

export default function MicroAdjustmentTest() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const runFrameRef = useRef<(timestamp: number) => void>(() => {});
  const attemptsRef = useRef<MicroAttempt[]>([]);
  const cameraAimRef = useRef<CameraAim>({ ...DEFAULT_CAMERA_AIM });
  const trailRef = useRef<Point[]>([]);
  const targetRef = useRef<Target | null>(null);
  const targetSpawnedAtRef = useRef(0);
  const startDistanceRef = useRef(0);
  const closestDistanceRef = useRef(Number.POSITIVE_INFINITY);
  const startTimeRef = useRef(0);
  const elapsedBeforePauseRef = useRef(0);
  const overCorrectionRef = useRef(0);
  const underCorrectionRef = useRef(0);
  const mouseRadiansPerCountRef = useRef(0);
  const phaseRef = useRef<TestPhase>("idle");

  const [phase, setPhase] = useState<TestPhase>("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [timeLeftMs, setTimeLeftMs] = useState(TEST_DURATION_MS);
  const [metrics, setMetrics] = useState<MicroMetrics | null>(null);
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
    cameraAimRef.current = { ...DEFAULT_CAMERA_AIM };
  }, []);

  const spawnTarget = useCallback((width: number, height: number) => {
    resetAim();
    trailRef.current = [];
    const target = generateMicroTarget();
    const finish = getTargetScreenPosition(
      target,
      DEFAULT_CAMERA_AIM,
      width,
      height,
    );
    const startDistancePx = distance(getCursorScreenPosition(cameraAimRef.current, width, height), finish);

    targetRef.current = target;
    startDistanceRef.current = startDistancePx;
    targetSpawnedAtRef.current = performance.now();
    closestDistanceRef.current = startDistancePx;
  }, [resetAim]);

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
    if (!context) {
      return;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const cursor = getCursorScreenPosition(cameraAimRef.current, rect.width, rect.height);
    drawScene(context, rect.width, rect.height, null, cursor, trailRef.current);
  }, []);

  const finishTest = useCallback((shouldExitPointerLock = true) => {
    stopAnimation();
    elapsedBeforePauseRef.current = TEST_DURATION_MS;
    phaseRef.current = "complete";
    setPhase("complete");
    setTimeLeftMs(0);
    setMetrics(
      calculateMetrics(
        attemptsRef.current,
        overCorrectionRef.current,
        underCorrectionRef.current,
      ),
    );
    setDiagnosticComplete("micro");

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

  const runFrame = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const target = targetRef.current;
      const elapsedMs =
        phaseRef.current === "running"
          ? elapsedBeforePauseRef.current + timestamp - startTimeRef.current
          : elapsedBeforePauseRef.current;
      const remainingMs = Math.max(TEST_DURATION_MS - elapsedMs, 0);
      const finish = target
        ? getTargetScreenPosition(target, DEFAULT_CAMERA_AIM, rect.width, rect.height)
        : null;
      const cursor = getCursorScreenPosition(cameraAimRef.current, rect.width, rect.height);
      pushTrailPoint(trailRef.current, cursor);

      if (finish) {
        const currentDistance = distance(cursor, finish);

        closestDistanceRef.current = Math.min(
          closestDistanceRef.current,
          currentDistance,
        );
      }

      setTimeLeftMs(remainingMs);
      drawScene(context, rect.width, rect.height, finish, cursor, trailRef.current);

      if (phaseRef.current === "running" && elapsedMs >= TEST_DURATION_MS) {
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
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    if (!targetRef.current) {
      spawnTarget(rect.width, rect.height);
    }

    stopAnimation();
    phaseRef.current = "running";
    setPhase("running");
    setTimeLeftMs(Math.max(TEST_DURATION_MS - elapsedBeforePauseRef.current, 0));

    const runStartedAt = performance.now();
    startTimeRef.current = runStartedAt;
    targetSpawnedAtRef.current = runStartedAt;
    closestDistanceRef.current = startDistanceRef.current;

    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      runFrameRef.current(timestamp);
    });
  }, [spawnTarget, stopAnimation]);

  const beginCountdown = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    stopAnimation();
    spawnTarget(rect.width, rect.height);
    setCountdown(COUNTDOWN_SECONDS);
    phaseRef.current = "countdown";
    setPhase("countdown");
    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      runFrameRef.current(timestamp);
    });
  }, [spawnTarget, stopAnimation]);

  const resumeTest = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    try {
      await requestRawPointerLock(canvas);
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

  const refreshMouseDpiScale = useCallback(() => {
    mouseRadiansPerCountRef.current = getStoredMouseRadiansPerCount();
  }, []);

  useEffect(() => {
    refreshMouseDpiScale();
  }, [refreshMouseDpiScale]);

  const startTest = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    refreshMouseDpiScale();
    stopAnimation();
    attemptsRef.current = [];
    overCorrectionRef.current = 0;
    underCorrectionRef.current = 0;
    trailRef.current = [];
    targetRef.current = null;
    resetAim();
    setMetrics(null);
    setCountdown(COUNTDOWN_SECONDS);
    setTimeLeftMs(TEST_DURATION_MS);
    elapsedBeforePauseRef.current = 0;

    try {
      await requestRawPointerLock(canvas);
      beginCountdown();
    } catch {
      setIsPointerLocked(false);
      phaseRef.current = "idle";
      setPhase("idle");
    }
  }, [beginCountdown, refreshMouseDpiScale, resetAim, stopAnimation]);

  const handleShoot = useCallback(() => {
    if (phaseRef.current !== "running") {
      return;
    }

    const canvas = canvasRef.current;
    const target = targetRef.current;
    if (!canvas || !target) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const finish = getTargetScreenPosition(target, DEFAULT_CAMERA_AIM, rect.width, rect.height);
    const cursor = getCursorScreenPosition(cameraAimRef.current, rect.width, rect.height);
    const finalDistancePx = distance(cursor, finish);
    const result = getMicroAdjustmentResult(
      finalDistancePx,
      closestDistanceRef.current,
      TARGET_RADIUS,
    );
    const wasHit = result.hit === 1;
    const timeToClickMs = performance.now() - targetSpawnedAtRef.current;

    overCorrectionRef.current += result.overCorrection;
    underCorrectionRef.current += result.underCorrection;

    attemptsRef.current.push({
      wasHit,
      timeToClickMs,
      missDistancePx: wasHit ? 0 : finalDistancePx,
      startDistancePx: startDistanceRef.current,
      finalDistancePx,
      closestDistancePx: closestDistanceRef.current,
    });

    spawnTarget(rect.width, rect.height);
  }, [spawnTarget]);

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
        if (elapsedBeforePauseRef.current > 0 || attemptsRef.current.length > 0) {
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

      applyMouseMovementToCamera(
        cameraAimRef.current,
        event.movementX,
        event.movementY,
        mouseRadiansPerCountRef.current,
      );
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleShoot);

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleShoot);
    };
  }, [handleShoot, pauseTest, stopAnimation]);

  const handlePrimaryAction = useCallback(() => {
    refreshMouseDpiScale();

    if (phase === "paused") {
      void resumeTest();
      return;
    }

    void startTest();
  }, [phase, refreshMouseDpiScale, resumeTest, startTest]);

  return (
    <main className="h-screen overflow-hidden bg-black text-zinc-100">
      <section className="relative flex h-full flex-col">
        <div className="absolute left-0 right-0 top-0 z-10 flex items-start justify-between gap-4 p-4 text-sm text-zinc-300 sm:p-6">
          <div>
            <p className="font-semibold uppercase text-zinc-500">Mouse Fit Diagnostic</p>
            <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              Micro-adjustment Test
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
          aria-label="Micro-adjustment test arena"
        />

        {phase === "countdown" && (
          <div className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2 px-6 text-center">
            <p className="font-mono text-lg font-semibold uppercase text-white sm:text-xl">
              Get ready in {countdown}s
            </p>
          </div>
        )}

        {phase !== "running" && phase !== "countdown" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto bg-black/70 px-6 py-8">
            <div className="max-h-[calc(100vh-4rem)] w-full max-w-2xl overflow-y-auto border border-zinc-800 bg-black p-6 text-center shadow-2xl">
              <p className="text-sm uppercase text-zinc-500">
                {phase === "paused" ? "Paused" : "30 seconds"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                ด่านนี้เช็ก micro-adjust feel จากการลากระยะสั้น
              </h2>
              <p className="mt-4 leading-7 text-zinc-400">
                finish zone จะอยู่ใกล้จุดเริ่ม ให้ขยับสั้น ๆ แล้วคลิกยืนยัน
                ด่านนี้ช่วยดูว่าเมาส์คุมรายละเอียดเล็ก ๆ ได้ดีแค่ไหน
              </p>
              <div className="mt-5 text-left">
                <p className="text-sm font-semibold text-zinc-200">ระหว่างเล่น ลองสังเกตว่า:</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-400">
                  <li>ขยับนิดเดียวแล้ว cursor ไปตามที่คิดไหม</li>
                  <li>คุณแก้เลย finish zone แล้วต้องดึงกลับบ่อยหรือเปล่า</li>
                  <li>ตอนหยุดใน zone มือยังนิ่งไหม</li>
                  <li>จังหวะคลิกทำให้ cursor ขยับหลุดจาก zone หรือไม่</li>
                </ul>
                <p className="mt-4 text-sm leading-6 text-zinc-500">
                  คะแนนช่วยบอกภาพรวม แต่ฟีลการคุมระยะสั้นจะบอกว่าเมาส์เข้ากับมือคุณแค่ไหน
                </p>
              </div>
              <DiagnosticProfileControls onProfileChange={refreshMouseDpiScale} />
              <button
                className="mt-6 w-full border border-emerald-400 bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:bg-emerald-300"
                type="button"
                onClick={handlePrimaryAction}
              >
                {phase === "paused"
                  ? "Continue"
                  : phase === "complete"
                    ? "Run again"
                    : "Start micro test"}
              </button>
            </div>
          </div>
        )}

        {metrics && (
          <aside className="absolute bottom-4 left-4 right-4 z-30 grid gap-3 border border-zinc-800 bg-black/90 p-4 text-sm text-zinc-300 sm:left-auto sm:w-[420px] sm:grid-cols-2">
            <Metric label="Accuracy" value={`${Math.round(metrics.accuracy * 100)}%`} />
            <Metric label="Hits / misses" value={`${metrics.hits}/${metrics.misses}`} />
            <Metric label="Avg click" value={`${metrics.averageTimeToClickMs}ms`} />
            <Metric label="Avg miss" value={`${metrics.averageMissDistancePx}px`} />
            <Metric label="Over-correct" value={`${Math.round(metrics.overCorrectionRate * 100)}%`} />
            <Metric label="Fine control" value={`${Math.round(metrics.fineControlScore * 100)}%`} />
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
