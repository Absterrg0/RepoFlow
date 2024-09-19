import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authValues from '@/lib/auth';

export async function middleware(req: NextRequest) {
    const session = await getServerSession(authValues);

    // Protect the approval page and API routes
    if (req.nextUrl.pathname.startsWith('/api/approve-repo') || req.nextUrl.pathname.startsWith('/admin/approve-repo')) {
        if (!session || !session.user.isAdmin) {
            return NextResponse.redirect(new URL('/404', req.url));
        }
    }

    return NextResponse.next();
}
