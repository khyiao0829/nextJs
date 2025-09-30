import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  // 예시: 고정 변환 (DB나 OpenAI 대신)
  let koreanNames: string[] = [];
  if (name.includes("彩香")) koreanNames = ["채원", "하연", "아린"];
  else if (name.includes("知里")) koreanNames = ["지연", "지윤", "지아"];
  else koreanNames = ["DB/AI 필요"];

  return NextResponse.json({ koreanNames });
}
