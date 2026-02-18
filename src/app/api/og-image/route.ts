import { NextRequest, NextResponse } from "next/server";

const MAX_BYTES = 64 * 1024;

function parseOgImage(html: string): string | null {
  const match =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    ) ??
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
    );
  return match?.[1] ?? null;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ ogImage: null }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
      signal: AbortSignal.timeout(5000),
    });

    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json({ ogImage: null });
    }

    const decoder = new TextDecoder("utf-8");
    let total = 0;
    let html = "";

    while (total < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      total += value.length;
      html += decoder.decode(value, { stream: true });

      const ogImage = parseOgImage(html);
      if (ogImage) {
        reader.releaseLock();
        return NextResponse.json({ ogImage });
      }
    }

    html += decoder.decode();
    return NextResponse.json({ ogImage: parseOgImage(html) });
  } catch {
    return NextResponse.json({ ogImage: null });
  }
}
