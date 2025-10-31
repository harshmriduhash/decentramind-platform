import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: message || 'Hello, this is a test message.',
          },
        ],
        max_tokens: 50,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        message: 'OpenAI API test successful',
        response: data.choices[0]?.message?.content || 'Test response',
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: `OpenAI API error: ${response.status}`,
          details: errorData,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('OpenAI test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to test OpenAI API',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 