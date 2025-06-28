import { NextResponse } from 'next/server';
import prisma from '@/app/config/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const bookName = searchParams.get('bookName');
    
    if (!bookName) {
        return NextResponse.json(
            { error: 'Book Name is required' },
            { status: 400 }
        );
    }
    
    try {
        const messages = await prisma.message.findMany({
            where: {
                bookName: bookName,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        
        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}
