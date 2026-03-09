import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request as form-data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Prepare FormData to send to Python backend
    const backendFormData = new FormData();
    backendFormData.append('file', file, file.name);

    // Send to Python backend
    const backendRes = await fetch('http://127.0.0.1:8000/api/prompts/add/file', {
      method: 'POST',
      body: backendFormData,
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
