import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  // 1) DB 조회
  const { data, error } = await supabase
    .from("japanese_names")
    .select("korean_equivalent, meaning")
    .eq("kanji", name)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data) {
    // DB에서 찾은 결과 반환
    return NextResponse.json({
      koreanNames: data.korean_equivalent,
      meaning: data.meaning,
      source: "db",
    });
  }

  // 2) DB에 없으면 OpenAI에 요청
  const prompt = `
  일본 이름 "${name}"을 한국식으로 변환하세요.
  - 한자 의미를 고려해 한국에서 실제 쓰일 법한 이름 2~3개 제안.
  - 너무 일본풍이지 않고, 자연스럽게 들리게.
  결과는 콤마(,)로 구분해 주세요.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  const answer = completion.choices[0].message?.content ?? "";
  const candidates = answer.split(/,|、|\s/).map((s) => s.trim()).filter(Boolean);

  // 3) 새 결과를 DB에 저장 (캐싱)
  await supabase.from("japanese_names").insert({
    kanji: name,
    korean_equivalent: candidates,
  });

  return NextResponse.json({
    koreanNames: candidates,
    source: "openai",
  });
}
