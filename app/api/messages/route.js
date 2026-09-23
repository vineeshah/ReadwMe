import { NextResponse } from 'next/server';
import prisma from '@/app/config/db';
import { toRoomKey } from '@/app/lib/normalize';

// GET /api/messages?bookName=...&page=1&limit=50
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const bookName = searchParams.get('bookName');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const normalizedBookName = toRoomKey(bookName);

    if (!bookName) {
        return NextResponse.json(
            { error: 'Book Name is required' },
            { status: 400 }
        );
    }

    try {
        const [messages, total] = await Promise.all([
            prisma.message.findMany({
                where: { bookName: normalizedBookName },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            spotifyToken: true,
                        },
                    },
                },
                orderBy: { createdAt: 'asc' },
                skip: page * limit,
                take: limit,
            }),
            prisma.message.count({ where: { bookName: normalizedBookName } }),
        ]);

        return NextResponse.json({
            messages,
            page,
            total,
            hasMore: page * limit < total,
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}
