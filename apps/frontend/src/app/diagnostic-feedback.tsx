"use client";

import { useEffect, useState } from "react";
import type { DiagnosticKey } from "./diagnostic-progress";

const DIAGNOSTIC_FEEDBACK_STORAGE_KEY = "mouse-fit-diagnostic-feedback";

const feelOptions = [
  "นิ่ง / คุมง่าย",
  "ไหลเกิน / ลากเลย",
  "ฝืด / หยุดก่อน",
  "สั่น / ไม่นิ่ง",
  "ปวดมือ / เกร็งมือ",
] as const;

type DiagnosticFeedback = {
  feel: string;
  note: string;
  updatedAt: string;
};

type StoredDiagnosticFeedback = Partial<Record<DiagnosticKey, DiagnosticFeedback>>;

type DiagnosticFeedbackFormProps = {
  testKey: DiagnosticKey;
  prompt: string;
};

function getStoredFeedback(): StoredDiagnosticFeedback {
  if (typeof window === "undefined") {
    return {};
  }

  const savedFeedback = window.sessionStorage.getItem(
    DIAGNOSTIC_FEEDBACK_STORAGE_KEY,
  );
  if (!savedFeedback) {
    return {};
  }

  try {
    const parsedFeedback = JSON.parse(savedFeedback);

    if (!parsedFeedback || typeof parsedFeedback !== "object") {
      return {};
    }

    return parsedFeedback as StoredDiagnosticFeedback;
  } catch {
    window.sessionStorage.removeItem(DIAGNOSTIC_FEEDBACK_STORAGE_KEY);
    return {};
  }
}

function saveFeedback(testKey: DiagnosticKey, feedback: DiagnosticFeedback) {
  if (typeof window === "undefined") {
    return;
  }

  const storedFeedback = getStoredFeedback();
  storedFeedback[testKey] = feedback;
  window.sessionStorage.setItem(
    DIAGNOSTIC_FEEDBACK_STORAGE_KEY,
    JSON.stringify(storedFeedback),
  );
}

export function DiagnosticFeedbackForm({
  testKey,
  prompt,
}: DiagnosticFeedbackFormProps) {
  const [feel, setFeel] = useState("");
  const [note, setNote] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const loadFeedbackTimer = window.setTimeout(() => {
      const savedFeedback = getStoredFeedback()[testKey];
      if (!savedFeedback) {
        return;
      }

      setFeel(savedFeedback.feel);
      setNote(savedFeedback.note);
    }, 0);

    return () => window.clearTimeout(loadFeedbackTimer);
  }, [testKey]);

  function handleSave() {
    saveFeedback(testKey, {
      feel,
      note,
      updatedAt: new Date().toISOString(),
    });
    setSavedMessage("Saved feedback in this session");
  }

  return (
    <div className="mt-6 border border-zinc-800 bg-zinc-950/80 p-4 text-left">
      <p className="text-sm font-semibold text-zinc-200">
        หลังจบด่านนี้ รู้สึกยังไงกับเมาส์?
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{prompt}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {feelOptions.map((option) => (
          <button
            className={`border px-3 py-2 text-left text-sm transition ${
              feel === option
                ? "border-emerald-400 bg-emerald-400 text-black"
                : "border-zinc-800 bg-black text-zinc-300 hover:border-zinc-600"
            }`}
            key={option}
            type="button"
            onClick={() => {
              setFeel(option);
              setSavedMessage("");
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <textarea
        className="mt-3 min-h-24 w-full resize-none border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400"
        placeholder="เขียนเพิ่มได้ เช่น ตอนหยุดเป้าเมาส์ไหลไปนิดนึง หรือรู้สึกคุมง่ายกว่าที่คิด"
        value={note}
        onChange={(event) => {
          setNote(event.target.value);
          setSavedMessage("");
        }}
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-600">
          เก็บเฉพาะใน session ของ browser นี้ก่อน
        </p>
        <button
          className="border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-emerald-400 hover:text-emerald-300"
          type="button"
          onClick={handleSave}
        >
          Save feeling
        </button>
      </div>

      {savedMessage && (
        <p className="mt-2 text-xs font-medium text-emerald-300">{savedMessage}</p>
      )}
    </div>
  );
}
