import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authValues from '@/lib/auth';
import client from '@/db'
export async function DELETE(request: Request) {
  const session = await getServerSession(authValues);

  // Ensure the user is authenticated and has admin rights
  if (!session || !session.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const repoId = url.searchParams.get('repoId'); // Extract repoId from query parameters
  if (!repoId) {
    return new NextResponse('Repository ID is required', { status: 400 });
  }

  try {
    const deletedRepo = await client.repository.delete({
      where: { id: Number(repoId) }, // Ensure repoId is a number
    });

    return NextResponse.json(deletedRepo);
  } catch (error) {
    console.error('Error deleting repository:', error);

    // Handle potential Prisma errors (e.g., if the repo doesn't exist)
    return new NextResponse('Error deleting repository', { status: 500 });
  }
}
