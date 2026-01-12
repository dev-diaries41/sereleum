import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {

    // Prepare FormData to send to Python backend
    // Send to Python backend
    const backendRes = await fetch('http://127.0.0.1:8000/api/clusters', {
      method: 'POST',
      body: null,
    });

    if (!backendRes.ok) {
      const text = await backendRes.text();
      return NextResponse.json({ error: text }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json({ status: 'success', data });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ received: false, error: error.message }, { status: 500 });
  }
}
