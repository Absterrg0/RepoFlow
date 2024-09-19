import { NextResponse } from 'next/server';
import client from '@/db'
import { getServerSession } from 'next-auth';
import { authValues } from '@/lib/auth'; // Adjust the import based on your NextAuth configuration

export async function GET() {
  const session = await getServerSession(authValues);

  // Ensure the user is authenticated and has admin rights
  if (!session || !session.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const repositories = await client.repository.findMany({
      where: { isApproved: false },
    });
    return NextResponse.json(repositories);
  } catch (error) {
    console.error('Error fetching awaiting approval repositories:', error);
    return new NextResponse('Error fetching repositories', { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authValues);

  // Ensure the user is authenticated and has admin rights
  if (!session || !session.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { repoId } = await request.json();

  try {
    const updatedRepo = await client.repository.update({
      where: { id: repoId },
      data: { isApproved: true },
    });
    return NextResponse.json(updatedRepo);
  } catch (error) {
    console.error('Error approving repository:', error);
    return new NextResponse('Error approving repository', { status: 500 });
  }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authValues);
  
    // Ensure the user is authenticated and has admin rights
    if (!session || !session.user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  
    const { repoId } = await request.json();
  
    try {
      const updatedRepo = await client.repository.delete({
        where: { id: repoId },
      });
      return NextResponse.json(updatedRepo);
    } catch (error) {
      console.error('Error approving repository:', error);
      return new NextResponse('Error approving repository', { status: 500 });
    }
  }
  