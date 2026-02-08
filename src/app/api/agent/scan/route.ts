import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const apiKey = cookieStore.get('greenstick_api_key')?.value;

        if (!apiKey) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/agent/scan`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Scan error:', error);
        return NextResponse.json(
            { error: 'Failed to trigger scan', details: String(error) },
            { status: 500 }
        );
    }
}
