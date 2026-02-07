import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const apiKey = cookieStore.get('greenstick_api_key')?.value;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const response = await fetch(`${BACKEND_URL}/stats`, { headers });

        if (!response.ok) {
            if (response.status === 401) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Stats fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats', details: String(error) },
            { status: 500 }
        );
    }
}
