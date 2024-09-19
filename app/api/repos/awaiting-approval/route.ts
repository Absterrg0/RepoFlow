import client from "@/db";
import authValues from "@/lib/auth";
import { getServerSession } from "next-auth";
import {  NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authValues);

    if (!session?.user) {
        return NextResponse.json({
            msg: "Unauthorized",
        }, { status: 401 });
    }

    try {
        // Fetch repositories awaiting approval for the logged-in user
        const awaitingApprovalRepos = await client.repository.findMany({
            where: {
                user: {
                    username: session.user.name!,
                },
                isApproved:false
            },
        });

        return NextResponse.json(awaitingApprovalRepos);
    } catch (error) {
        console.error('Error fetching awaiting approval repositories:', error);
        return NextResponse.json({
            msg: "Error fetching repositories.",
        }, { status: 500 });
    }
}
