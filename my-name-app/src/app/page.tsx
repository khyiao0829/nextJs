"use client";
import { useState } from "react";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string[] | null>(null);

  async function handleConvert() {
    const res = await fetch("/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: input }),
    });
    const data = await res.json();
    setResult(data.koreanNames);
  }

  return (
    <main className="flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold mb-4">日本名 → 한국식 변환기</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="例: 彩香, 知里"
        className="border p-2 rounded w-64"
      />
      <button
        onClick={handleConvert}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
      >
        변환하기
      </button>

      {result && (
        <ul className="mt-6 list-disc">
          {result.map((name, i) => (
            <li key={i}>{name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
