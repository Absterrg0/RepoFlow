import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authValues from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authValues);

  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ role: 'USER' }, { status: 401 });
  }

  return NextResponse.json({ role: 'ADMIN' });
}
