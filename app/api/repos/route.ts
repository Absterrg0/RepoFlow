import client from "@/db";
import authValues from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch all approved repositories
        const repositories = await client.repository.findMany({
            where: {
                isApproved: true,
            },
        });
        return NextResponse.json(repositories);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        return NextResponse.json({
            msg: "Error fetching repositories.",
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authValues);

        if (!session?.user) {
            return NextResponse.json({
                msg: "Unauthorized",
            }, { status: 401 });
        }

        const body = await req.json();

        if (!session.user.username) {
            return NextResponse.json({
                msg: "Invalid user data",
            }, { status: 400 });
        }

        // Try to find the user, if not found, create a new one
        let user = await client.user.findUnique({
            where: {
                username: session.user.username,
            },
        });

        if (!user) {
            // Create a new user if not found
            user = await client.user.create({
                data: {
                    username: session.user.username,
                    isAdmin: false, // Default value for new users
                },
            });
        }

        // Create repository with default approval status as false
        const repository = await client.repository.create({
            data: {
                name: body.name,
                description: body.description,
                url: body.url,
                techStack:body.techStack,
                userId: user.id,
                isApproved: false, // Default value indicating that the repository needs approval
            },
        });

        return NextResponse.json(repository);
    } catch (error) {
        console.error('Error creating repository:', error);
        return NextResponse.json({
            msg: "Error creating repository. It may already exist or there was a server error.",
        }, { status: 400 });
    }
}
