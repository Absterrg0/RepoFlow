import authValues from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import client from '@/db';

export async function GET() {
  // Retrieve the current session
  const session = await getServerSession(authValues);

  // Check if the user is authenticated
  if (!session?.user) {
    return NextResponse.json(
      { msg: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Fetch bookmarked repositories for the authenticated user
    const bookmarks = await client.bookMarks.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        repository: true, // Fetches the related repository details
      }
    });

    // Extract repository details


    // Return the list of bookmarked repositories
    return NextResponse.json(bookmarks, { status: 200 });
  } catch (error) {
    // Handle potential errors
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { msg: "Error fetching bookmarks" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  const session = await getServerSession(authValues);

  // Check if the user is authenticated
  if (!session?.user) {
    return NextResponse.json(
      { msg: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Parse the request body to get the repositoryId
    const { repositoryId } = await req.json();
    if (!repositoryId) {
      return NextResponse.json(
        { msg: "Repository ID is required" },
        { status: 400 }
      );
    }

    // Check if the bookmark already exists
    const existingBookmark = await client.bookMarks.findUnique({
      where: {
        userId_repositoryId: {
          userId: session.user.id,
          repositoryId: repositoryId,
        },
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { msg: "Repository already bookmarked" },
        { status: 409 }
      );
    }

    // Create a new bookmark
    const response = await client.bookMarks.create({
      data: {
        userId: session.user.id,
        repositoryId: repositoryId,
      },
    });

    // Return the created bookmark
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { msg: "Error creating bookmark" },
      { status: 500 }
    );
  }
}
