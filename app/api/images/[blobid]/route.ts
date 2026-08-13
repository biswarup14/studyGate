import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ blobid: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { blobid } = await params;
  if (!/^\d{1,30}$/.test(blobid)) {
    return new NextResponse("Invalid image id", { status: 400 });
  }

  const file = path.join(process.cwd(), "public", "images", "legacy", `${blobid}.img`);
  let data: Buffer;
  try {
    data = fs.readFileSync(file);
  } catch {
    const fallback = req.nextUrl.searchParams.get("url");
    if (fallback && /^https?:\/\//.test(fallback)) {
      return NextResponse.redirect(fallback, 302);
    }
    return new NextResponse("Image not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": sniffImageType(data),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

function sniffImageType(buf: Buffer): string {
  if (buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return "image/png";
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  const head = buf.length >= 6 ? buf.toString("latin1", 0, 6) : "";
  if (head === "GIF87a" || head === "GIF89a") return "image/gif";
  if (
    buf.length >= 12 &&
    buf.toString("latin1", 0, 4) === "RIFF" &&
    buf.toString("latin1", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (buf.length >= 2 && buf.toString("latin1", 0, 2) === "BM") return "image/bmp";
  return "image/jpeg";
}
