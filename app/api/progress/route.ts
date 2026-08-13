import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.progress.findMany({
    where: { userId: session.user.id },
  });

  const data: Record<string, { attempts: number; correct: number; lastSeen: string }> = {};
  for (const r of rows) {
    data[r.questionId] = {
      attempts: r.attempts,
      correct: r.correct,
      lastSeen: r.lastSeen.toISOString(),
    };
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { questionId, correct } = await req.json();
  if (!questionId || typeof correct !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await prisma.progress.upsert({
    where: {
      userId_questionId: {
        userId: session.user.id,
        questionId,
      },
    },
    update: {
      attempts: { increment: 1 },
      correct: { increment: correct ? 1 : 0 },
      lastSeen: new Date(),
    },
    create: {
      userId: session.user.id,
      questionId,
      attempts: 1,
      correct: correct ? 1 : 0,
      lastSeen: new Date(),
    },
  });

  return NextResponse.json({
    attempts: updated.attempts,
    correct: updated.correct,
    lastSeen: updated.lastSeen.toISOString(),
  });
}
