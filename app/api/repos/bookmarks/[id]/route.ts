import { NextResponse } from 'next/server';
import client from '@/db'
import { getServerSession } from 'next-auth';
import authValues from '@/lib/auth';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authValues)
    if(!session){
        return NextResponse.json({
            msg:"Unauthorized"
        })
    }
  const { id } = params;

  try {
    // Delete the bookmark from the database
    const deletedBookmark = await client.bookMarks.delete({
      where:{
        userId_repositoryId:{
            userId:session.user.id,
            repositoryId:Number(id)
        }
      }
    });

    return NextResponse.json(deletedBookmark, { status: 200 });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}
