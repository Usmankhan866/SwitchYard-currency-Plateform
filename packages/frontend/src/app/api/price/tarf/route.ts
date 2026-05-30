import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.PRICING_API_URL ?? "https://pricing-enginee.onrender.com";

export async function POST(req: NextRequest) {
  const apiKey = process.env.PRICING_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "PRICING_API_KEY not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${BASE_URL}/price/tarf`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Pricing engine unreachable", detail: String(err) },
      { status: 502 },
    );
  }

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
