import { NextRequest, NextResponse } from 'next/server';
import { finishAttempt } from '@/app/actions/quiz';

export async function POST(req: NextRequest) {
  try {
    const { attemptId } = await req.json();
    if (!attemptId) return NextResponse.json({ error: 'missing attemptId' }, { status: 400 });
    await finishAttempt(attemptId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
