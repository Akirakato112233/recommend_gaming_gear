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
  projectAngularTarget,
} from "../fps-camera";

const TEST_DURATION_MS = 30_000;
const COUNTDOWN_SECONDS = 3;
const TARGET_RADIUS = 18;
const CURSOR_RADIUS = 5;
const TRAIL_LIMIT = 180;

type TestPhase = "idle" | "countdown" | "running" | "complete";


function getTargetWorldPosition(elapsedMs: number): AngularTarget {
  const t = elapsedMs / 1000;

  return {
    yaw: Math.sin(t * 1.45) * 0.22 + Math.sin(t * 2.75 + 1.4) * 0.08,
    pitch: Math.sin(t * 1.1 + 0.75) * 0.08 + Math.sin(t * 2.05) * 0.035,
  };
}

function getTargetScreenPosition(
  elapsedMs: number,
  width: number,
  height: number,
): Point {
  return projectAngularTarget(
    getTargetWorldPosition(elapsedMs),
    DEFAULT_CAMERA_AIM,
    width,
    height,
  );
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
  guide: Point,
  cursor: Point,
  trail: Point[],
  elapsedMs: number,
) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);

  context.beginPath();
  for (let index = 0; index <= 90; index += 1) {
    const point = getTargetScreenPosition(
      elapsedMs - 1800 + index * 40,
      width,
      height,
    );

    if (index === 0) {
      context.moveTo(point.x, point.y);
    } else {
      context.lineTo(point.x, point.y);
    }
  }
  context.strokeStyle = "rgba(52, 211, 153, 0.28)";
  context.lineWidth = 2;
  context.stroke();

  context.beginPath();
  context.arc(guide.x, guide.y, TARGET_RADIUS, 0, Math.PI * 2);
  context.strokeStyle = "#fbbf24";
  context.lineWidth = 2;
  context.stroke();

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

export default function TrackingTest() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const runFrameRef = useRef<(timestamp: number) => void>(() => {});
  const runCountdownFrameRef = useRef<(timestamp: number) => void>(() => {});
  const cursorRef = useRef<Point>({ x: 0, y: 0 });
  const trailRef = useRef<Point[]>([]);
  const startTimeRef = useRef<number>(0);
  const targetStartTimeRef = useRef<number>(0);
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
      if (cursorRef.current.x === 0 && cursorRef.current.y === 0) {
        resetCursor(rect.width, rect.height);
      }

      const guide = getTargetScreenPosition(0, rect.width, rect.height);
      const cursor = cursorRef.current;
      drawScene(
        context,
        rect.width,
        rect.height,
        guide,
        cursor,
        trailRef.current,
        0,
      );
    }
  }, [resetCursor]);

  const finishTest = useCallback(() => {
    stopAnimation();
    phaseRef.current = "complete";
    setPhase("complete");
    setTimeLeftMs(0);
    setDiagnosticComplete("tracking");
  }, [stopAnimation]);

  const runCountdownFrame = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || phaseRef.current !== "countdown") {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const elapsedMs = timestamp - targetStartTimeRef.current;
    const guide = getTargetScreenPosition(
      elapsedMs,
      rect.width,
      rect.height,
    );
    const cursor = cursorRef.current;
    pushTrailPoint(trailRef.current, cursor);

    drawScene(context, rect.width, rect.height, guide, cursor, trailRef.current, elapsedMs);

    animationFrameRef.current = requestAnimationFrame((nextTimestamp) => {
      runCountdownFrameRef.current(nextTimestamp);
    });
  }, []);

  const beginCountdown = useCallback(() => {
    stopAnimation();
    trailRef.current = [];
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
      const elapsedMs = timestamp - startTimeRef.current;
      const remainingMs = Math.max(TEST_DURATION_MS - elapsedMs, 0);
      const guide = getTargetScreenPosition(
        timestamp - targetStartTimeRef.current,
        rect.width,
        rect.height,
      );
      const cursor = cursorRef.current;
      pushTrailPoint(trailRef.current, cursor);

      setTimeLeftMs(remainingMs);
      drawScene(context, rect.width, rect.height, guide, cursor, trailRef.current, elapsedMs);

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
    setTimeLeftMs(TEST_DURATION_MS);
    startTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      runFrameRef.current(timestamp);
    });
  }, [stopAnimation]);

  useEffect(() => {
    runFrameRef.current = runFrame;
  }, [runFrame]);

  useEffect(() => {
    runCountdownFrameRef.current = runCountdownFrame;
  }, [runCountdownFrame]);

  useEffect(() => {
    const loadProgressTimer = window.setTimeout(() => {
      if (!isDiagnosticComplete("tracking")) {
        return;
      }

      stopAnimation();
      phaseRef.current = "complete";
      setPhase("complete");
      setTimeLeftMs(0);
    }, 0);

    return () => window.clearTimeout(loadProgressTimer);
  }, [stopAnimation]);

  const startTest = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    stopAnimation();
    trailRef.current = [];
    const rect = canvas.getBoundingClientRect();
    resetCursor(rect.width, rect.height);
    setCountdown(COUNTDOWN_SECONDS);
    setTimeLeftMs(TEST_DURATION_MS);
    targetStartTimeRef.current = performance.now();

    beginCountdown();
  }, [beginCountdown, resetCursor, stopAnimation]);

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

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
            <p className="text-emerald-300">
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
          <div className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto bg-black/70 px-6 py-8">
            <div className="max-h-[calc(100vh-4rem)] w-full max-w-2xl overflow-y-auto border border-zinc-800 bg-black p-6 text-center shadow-2xl">
              <p className="text-sm uppercase text-zinc-500">
                {phase === "complete" ? "Feedback" : "30 seconds"}
              </p>
              {phase === "complete" ? (
                <>
                  <h2 className="mt-3 text-3xl font-semibold text-white">
                    เล่นจบแล้ว ลองจับฟีล tracking ของเมาส์ตัวนี้
                  </h2>
                  <p className="mt-4 leading-7 text-zinc-400">
                    ไม่โชว์คะแนนดิบก่อน ให้ตอบจากความรู้สึกตอนลากตามเส้นจริง ๆ
                    เพราะ tracking feel บอกเรื่อง control, stability และความลื่นของเมาส์ได้ดี
                  </p>
                  <DiagnosticFeedbackForm
                    prompt="ตอนลากตามเส้น เมาส์เกาะทางดีไหม รู้สึกนิ่ง ไหล สั่น หรือจำเป็นต้องแก้เส้นบ่อยแค่ไหน"
                    testKey="tracking"
                  />
                </>
              ) : (
                <>
                  <h2 className="mt-3 text-3xl font-semibold text-white">
                    ด่านนี้เช็ก tracking feel จากการลากเมาส์ตามเส้น
                  </h2>
                  <p className="mt-4 leading-7 text-zinc-400">
                    ลากเมาส์ให้ trail ของคุณเกาะเส้น guide ให้มากที่สุด ไม่ต้องคลิก
                    ขยับแบบที่คุณเล่นจริง แล้วสังเกตว่าเมาส์คุมเส้นทางได้เนียนแค่ไหน
                  </p>
                  <div className="mt-5 text-left">
                    <p className="text-sm font-semibold text-zinc-200">ระหว่างเล่น ลองจับความรู้สึกว่า:</p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-400">
                      <li>trail หลุดจากเส้น guide ซ้าย/ขวาบ่อยไหม</li>
                      <li>ตอนเส้นเปลี่ยนทิศ คุณต้องแก้เมาส์เยอะหรือเปล่า</li>
                      <li>มือรู้สึกนิ่งหรือสั่นตอนพยายามลากให้เนียน</li>
                      <li>เมาส์ให้ฟีล control ดี หรือรู้สึกไหลเกินไป</li>
                    </ul>
                    <p className="mt-4 text-sm leading-6 text-zinc-500">
                      อย่าโฟกัสแค่คะแนน ให้จำฟีลตอน track ด้วย เพราะนี่คือข้อมูลสำคัญตอนแนะนำเมาส์
                    </p>
                  </div>
                </>
              )}
              <button
                className="mt-6 w-full border border-emerald-400 bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:bg-emerald-300"
                type="button"
                onClick={startTest}
              >
                {phase === "complete" ? "Run again" : "Start tracking"}
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
