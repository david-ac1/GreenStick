import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const incidentId = searchParams.get('incident_id') || 'trace-hq-001';

        const response = await fetch(`${BACKEND_URL}/agent/analyze?incident_id=${incidentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Agent analysis error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze incident', details: String(error) },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_URL}/`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Backend not reachable', details: String(error) },
            { status: 503 }
        );
    }
}
