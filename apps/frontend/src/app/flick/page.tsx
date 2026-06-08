"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DiagnosticFeedbackForm } from "../diagnostic-feedback";
import { isDiagnosticComplete, setDiagnosticComplete } from "../diagnostic-progress";
import {
  type AngularTarget,
  type Point,
  DEFAULT_CAMERA_AIM,
  clamp,
  distance,
  projectAngularTarget,
  randomInRange,
} from "../fps-camera";

const TEST_DURATION_MS = 30_000;
const COUNTDOWN_SECONDS = 3;
const TARGET_RADIUS = 22;
const CURSOR_RADIUS = 5;
const TRAIL_LIMIT = 90;

type TestPhase = "idle" | "countdown" | "running" | "complete";


type Target = AngularTarget;

function generateTarget(): Target {
  let target: Target = { yaw: 0, pitch: 0 };

  for (let attempt = 0; attempt < 20; attempt++) {
    target = {
      yaw: randomInRange(-0.36, 0.36),
      pitch: randomInRange(-0.18, 0.18),
    };

    if (distance({ x: target.yaw, y: target.pitch }, { x: 0, y: 0 }) >= 0.12) {
      return target;
    }
  }

  return target;
}

function getTargetScreenPosition(
  target: Target,
  width: number,
  height: number,
): Point {
  return projectAngularTarget(target, DEFAULT_CAMERA_AIM, width, height);
}

function getCanvasCenter(width: number, height: number): Point {
  return {
    x: width / 2,
    y: height / 2,
  };
}

function getCursorFromMouseEvent(event: MouseEvent, canvas: HTMLCanvasElement): Point {
  const rect = canvas.getBoundingClientRect();

  return {
    x: clamp(event.clientX - rect.left, 0, rect.width),
    y: clamp(event.clientY - rect.top, 0, rect.height),
  };
}

function pushTrailPoint(trail: Point[], point: Point) {
  trail.push(point);

  if (trail.length > TRAIL_LIMIT) {
    trail.shift();
  }
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
  context.arc(start.x, start.y, 8, 0, Math.PI * 2);
  context.strokeStyle = "rgba(53, 245, 208, 0.42)";
  context.lineWidth = 2;
  context.stroke();

  if (finish) {
    context.beginPath();
    context.arc(finish.x, finish.y, TARGET_RADIUS, 0, Math.PI * 2);
    context.strokeStyle = "#fbbf24";
    context.lineWidth = 2;
    context.stroke();

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(finish.x, finish.y);
    context.strokeStyle = "rgba(251, 191, 36, 0.18)";
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

export default function FlickTest() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const runFrameRef = useRef<(timestamp: number) => void>(() => {});
  const cursorRef = useRef<Point>({ x: 0, y: 0 });
  const trailRef = useRef<Point[]>([]);
  const targetRef = useRef<Target | null>(null);
  const startTimeRef = useRef(0);
  const phaseRef = useRef<TestPhase>("idle");

  const [phase, setPhase] = useState<TestPhase>("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [timeLeftMs, setTimeLeftMs] = useState(TEST_DURATION_MS);

  const displayTime = useMemo(() => {
    if (phase === "countdown") {
      return `${countdown}s`;
    }

    return `${Math.ceil(timeLeftMs / 1000)}s`;
  }, [countdown, phase, timeLeftMs]);

  const pointerStatusText = "Normal cursor speed";

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const resetCursor = useCallback((width: number, height: number) => {
    cursorRef.current = getCanvasCenter(width, height);
  }, []);

  const spawnTarget = useCallback(() => {
    trailRef.current = [];
    targetRef.current = generateTarget();
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
    if (!context) {
      return;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    if (cursorRef.current.x === 0 && cursorRef.current.y === 0) {
      resetCursor(rect.width, rect.height);
    }

    const cursor = cursorRef.current;
    drawScene(context, rect.width, rect.height, null, cursor, trailRef.current);
  }, [resetCursor]);

  const finishTest = useCallback(() => {
    stopAnimation();
    phaseRef.current = "complete";
    setPhase("complete");
    setTimeLeftMs(0);
    setDiagnosticComplete("flick");
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
          ? timestamp - startTimeRef.current
          : 0;
      const remainingMs = Math.max(TEST_DURATION_MS - elapsedMs, 0);
      const finish = target
        ? getTargetScreenPosition(target, rect.width, rect.height)
        : null;
      const cursor = cursorRef.current;
      pushTrailPoint(trailRef.current, cursor);

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

    if (!targetRef.current) {
      spawnTarget();
    }

    stopAnimation();
    phaseRef.current = "running";
    setPhase("running");
    setTimeLeftMs(TEST_DURATION_MS);
    const runStartedAt = performance.now();
    startTimeRef.current = runStartedAt;
    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      runFrameRef.current(timestamp);
    });
  }, [spawnTarget, stopAnimation]);

  const beginCountdown = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    stopAnimation();
    spawnTarget();
    setCountdown(COUNTDOWN_SECONDS);
    phaseRef.current = "countdown";
    setPhase("countdown");
    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      runFrameRef.current(timestamp);
    });
  }, [spawnTarget, stopAnimation]);

  useEffect(() => {
    runFrameRef.current = runFrame;
  }, [runFrame]);

  useEffect(() => {
    const loadProgressTimer = window.setTimeout(() => {
      if (!isDiagnosticComplete("flick")) {
        return;
      }

      stopAnimation();
      phaseRef.current = "complete";
      setPhase("complete");
      setTimeLeftMs(0);
    }, 0);

    return () => window.clearTimeout(loadProgressTimer);
  }, [stopAnimation]);

  const startTest = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    stopAnimation();
    trailRef.current = [];
    targetRef.current = null;
    const rect = canvas.getBoundingClientRect();
    resetCursor(rect.width, rect.height);
    setCountdown(COUNTDOWN_SECONDS);
    setTimeLeftMs(TEST_DURATION_MS);

    beginCountdown();
  }, [beginCountdown, resetCursor, stopAnimation]);

  const handleShoot = useCallback(() => {
    if (phaseRef.current !== "running") {
      return;
    }

    const canvas = canvasRef.current;
    const target = targetRef.current;
    if (!canvas || !target) {
      return;
    }

    spawnTarget();
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
    const handleMouseMove = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      const canMoveAim = phaseRef.current === "countdown" || phaseRef.current === "running";
      if (!canMoveAim || !canvas) {
        return;
      }

      cursorRef.current = getCursorFromMouseEvent(event, canvas);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleShoot);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleShoot);
    };
  }, [handleShoot]);

  return (
    <main className="h-screen overflow-hidden bg-black text-zinc-100">
      <section className="relative flex h-full flex-col">
        <div className="absolute left-0 right-0 top-0 z-10 flex items-start justify-between gap-4 p-4 text-sm text-zinc-300 sm:p-6">
          <div>
            <p className="font-semibold uppercase text-zinc-500">Mouse Fit Diagnostic</p>
            <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              Flick Test
            </h1>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl text-white">{displayTime}</p>
            <p className="text-emerald-300">
              {pointerStatusText}
            </p>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-none bg-black"
          aria-label="Flick test arena"
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
                {phase === "complete" ? "Feedback" : "30 seconds"}
              </p>
              {phase === "complete" ? (
                <>
                  <h2 className="mt-3 text-3xl font-semibold text-white">
                    เล่นจบแล้ว ลองจับฟีล flick ของเมาส์ตัวนี้
                  </h2>
                  <p className="mt-4 leading-7 text-zinc-400">
                    ไม่โชว์คะแนนดิบให้รบกวนก่อน ให้คุณตอบจากความรู้สึกจริงหลังลากเร็วแล้วหยุด
                    เพราะ feedback นี้สำคัญกับการแนะนำเมาส์มากกว่าเลขอย่างเดียว
                  </p>
                  <DiagnosticFeedbackForm
                    prompt="ตอน flick เมาส์หยุดตรงใจไหม มีลากเลย หยุดก่อน หรือรู้สึกต้องแก้ aim หลังคลิกบ่อยแค่ไหน"
                    testKey="flick"
                  />
                </>
              ) : (
                <>
                  <h2 className="mt-3 text-3xl font-semibold text-white">
                    ด่านนี้เช็ก flick feel จากการลากไปหยุดที่ finish zone
                  </h2>
                  <p className="mt-4 leading-7 text-zinc-400">
                    ลากจากจุดเริ่มไปยัง finish zone แล้วคลิกยืนยัน ด่านนี้ช่วยให้คุณเข้าใจว่าเมาส์
                    “ให้ฟีล” แบบไหนเวลาต้องขยับเร็วแล้วหยุดให้ตรง
                  </p>
                  <div className="mt-5 text-left">
                    <p className="text-sm font-semibold text-zinc-200">ระหว่างเล่น ลองสังเกตว่า:</p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-400">
                      <li>เมาส์หยุดตรง finish zone ตามที่คุณคิดไหม</li>
                      <li>คุณลากเลยจุดบ่อยหรือหยุดก่อนจุดบ่อย</li>
                      <li>มือรู้สึกนิ่งแค่ไหนหลังหยุด flick</li>
                      <li>การแก้ระยะเล็ก ๆ หลัง flick ทำได้ง่ายไหม</li>
                    </ul>
                    <p className="mt-4 text-sm leading-6 text-zinc-500">
                      อย่าโฟกัสแค่คะแนน ให้โฟกัสที่ความรู้สึกตอนเล่นด้วย โดยเฉพาะจังหวะหยุดจุด
                    </p>
                  </div>
                </>
              )}
              <button
                className="mt-6 w-full border border-emerald-400 bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:bg-emerald-300"
                type="button"
                onClick={startTest}
              >
                {phase === "complete" ? "Run again" : "Start flick test"}
              </button>
              <Link
                className="mt-3 block w-full border border-zinc-700 px-5 py-3 font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white"
                href="/"
              >
                Back to profile
              </Link>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
