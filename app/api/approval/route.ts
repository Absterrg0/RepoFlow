import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import client from '@/db'; // Adjust import path based on your setup
import { authValues } from '@/lib/auth'; // Adjust import path based on your NextAuth setup

export async function POST(req: Request) {
  const session = await getServerSession(authValues);
  console.log(session?.user)

  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  const { repoId } = await req.json();

  if (!repoId || typeof repoId !== 'number') {
    return NextResponse.json({ message: 'Invalid repository ID' }, { status: 400 });
  }

  try {
    // Update the repository to set isApproved to true
    const updatedRepo = await client.repository.update({
      where: { id: repoId },
      data: { isApproved: true },
    });

    return NextResponse.json(updatedRepo);
  } catch (error) {
    console.error('Error updating repository:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
