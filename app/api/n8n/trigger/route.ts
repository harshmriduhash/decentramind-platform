import { NextRequest, NextResponse } from 'next/server';

// Agent name to n8n workflow ID mapping
const AGENT_WORKFLOW_MAP: Record<string, string> = {
  calendar: '0vBc9gJYA3iJ5sos',
  email: 'KLifODuorqjN4a4M',
  phone: 'pa2wKv0LsdfvSWxn',
  personal_assistant: 'e0pthxtytY6HYTLO',
};

// Environment variables
const N8N_DOMAIN = process.env.N8N_DOMAIN || process.env.NEXT_PUBLIC_N8N_DOMAIN;
const N8N_API_KEY = process.env.N8N_API_KEY; // Optional for additional security

interface TriggerRequest {
  agentName: string;
  payload: any;
}

interface N8nResponse {
  success: boolean;
  data?: any;
  error?: string;
  workflowId?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<N8nResponse>> {
  try {
    // Parse request body
    const body: TriggerRequest = await request.json();
    const { agentName, payload } = body;

    // Validate required fields
    if (!agentName || !payload) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: agentName and payload are required',
        },
        { status: 400 }
      );
    }

    // Validate agent name
    if (!AGENT_WORKFLOW_MAP[agentName]) {
      return NextResponse.json(
        {
          success: false,
          error: `Unknown agent: ${agentName}. Available agents: ${Object.keys(AGENT_WORKFLOW_MAP).join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Check if N8N_DOMAIN is configured
    if (!N8N_DOMAIN) {
      return NextResponse.json(
        {
          success: false,
          error: 'N8N_DOMAIN not configured. Please set N8N_DOMAIN environment variable.',
        },
        { status: 500 }
      );
    }

    // Get workflow ID
    const workflowId = AGENT_WORKFLOW_MAP[agentName];

    // Prepare n8n webhook URL
    const n8nWebhookUrl = `https://${N8N_DOMAIN}/webhook/${workflowId}`;

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'User-Agent': 'DecentraMind-N8N-Trigger/1.0',
    };

    // Add API key if available
    if (N8N_API_KEY) {
      headers['Authorization'] = `Bearer ${N8N_API_KEY}`;
    }

    // Prepare payload with metadata
    const n8nPayload = {
      ...payload,
      metadata: {
        agentName,
        workflowId,
        timestamp: new Date().toISOString(),
        source: 'decentramind-api',
        requestId: crypto.randomUUID(),
      },
    };

    // Forward request to n8n
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(n8nPayload),
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    // Handle n8n response
    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`N8N webhook error: ${n8nResponse.status} - ${errorText}`);
      
      return NextResponse.json(
        {
          success: false,
          error: `N8N webhook failed: ${n8nResponse.status} ${n8nResponse.statusText}`,
          workflowId,
        },
        { status: n8nResponse.status }
      );
    }

    // Parse n8n response
    let n8nData;
    try {
      n8nData = await n8nResponse.json();
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      n8nData = await n8nResponse.text();
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      data: n8nData,
      workflowId,
    });

  } catch (error) {
    console.error('N8N trigger API error:', error);

    // Handle different error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      );
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to connect to N8N webhook. Please check N8N_DOMAIN configuration.',
        },
        { status: 502 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
