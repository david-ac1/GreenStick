import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
    return handleRequest(request, params, 'GET');
}

export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
    return handleRequest(request, params, 'POST');
}

async function handleRequest(request: NextRequest, params: { slug: string[] }, method: string) {
    try {
        const cookieStore = await cookies();
        const apiKey = cookieStore.get('greenstick_api_key')?.value;
        const slug = await params.slug; // Await params in newer Next.js versions
        const path = slug.join('/');

        if (!apiKey) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = `${BACKEND_URL}/esql/${path}${request.nextUrl.search}`;
        console.log(`[ES|QL Proxy] Forwarding ${method} request to: ${url}`);

        const headers: HeadersInit = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        };

        const body = method === 'POST' ? await request.json() : undefined;

        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            if (response.status === 401) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const errorText = await response.text();
            console.error(`[ES|QL Proxy] Backend error: ${response.status} - ${errorText}`);
            return NextResponse.json(
                { error: `Backend returned ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[ES|QL Proxy] Error:', error);
        return NextResponse.json(
            { error: 'Failed to proxy request', details: String(error) },
            { status: 500 }
        );
    }
}
