import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
    try {
        const { apiKey } = await request.json();

        if (!apiKey) {
            return NextResponse.json({ error: 'API key required' }, { status: 400 });
        }

        // Verify with backend
        const response = await fetch(`${BACKEND_URL}/auth/verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
        }

        const data = await response.json();

        // Set cookie for future requests
        const cookieStore = await cookies();
        cookieStore.set('greenstick_api_key', apiKey, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return NextResponse.json({ authenticated: true, user: data.user });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const apiKey = cookieStore.get('greenstick_api_key')?.value;

        if (!apiKey) {
            return NextResponse.json({ authenticated: false });
        }

        // Verify with backend
        const response = await fetch(`${BACKEND_URL}/auth/verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ authenticated: false });
        }

        const data = await response.json();
        return NextResponse.json({ authenticated: true, user: data.user });
    } catch {
        return NextResponse.json({ authenticated: false });
    }
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete('greenstick_api_key');
    return NextResponse.json({ success: true });
}
