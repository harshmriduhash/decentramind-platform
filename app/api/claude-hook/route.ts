import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hookType, operation, result, duration, userId, agentId } = body;

    // Validate required parameters
    if (!hookType || !operation) {
      return NextResponse.json(
        { error: 'Missing required parameters: hookType, operation' },
        { status: 400 }
      );
    }

    // Determine hook script path
    const hookScripts = {
      'pre_tool_use': 'decentramind-backend/.claude/hooks/pre_tool_use.py',
      'post_tool_use': 'decentramind-backend/.claude/hooks/post_tool_use.py',
      'notification': 'decentramind-backend/.claude/hooks/notification.py',
      'stop': 'decentramind-backend/.claude/hooks/stop.py',
      'subagent_stop': 'decentramind-backend/.claude/hooks/subagent_stop.py'
    };

    const scriptPath = hookScripts[hookType as keyof typeof hookScripts];
    if (!scriptPath) {
      return NextResponse.json(
        { error: `Invalid hook type: ${hookType}` },
        { status: 400 }
      );
    }

    // Build command arguments
    const args = [operation];
    if (result) args.push(result);
    if (duration) args.push(duration.toString());
    if (userId) args.push('--user-id', userId);
    if (agentId) args.push('--agent-id', agentId);

    // Execute hook script
    const command = `python3 ${scriptPath} ${args.join(' ')}`;
    console.log(`Executing Claude hook: ${command}`);

    const { stdout, stderr } = await execAsync(command);

    // Check exit code
    if (stderr && !stderr.includes('Warning')) {
      console.error(`Claude hook error: ${stderr}`);
      return NextResponse.json(
        { error: `Hook execution failed: ${stderr}` },
        { status: 500 }
      );
    }

    // Parse output for status
    const output = stdout.trim();
    const isBlocked = output.includes('❌ BLOCKED') || output.includes('exit code 2');
    const isAllowed = output.includes('✅ ALLOWED') || output.includes('exit code 0');

    if (isBlocked) {
      return NextResponse.json(
        { 
          status: 'blocked',
          message: output,
          operation,
          hookType
        },
        { status: 403 }
      );
    }

    if (isAllowed) {
      return NextResponse.json(
        { 
          status: 'allowed',
          message: output,
          operation,
          hookType,
          co2Impact: extractCO2Impact(output)
        },
        { status: 200 }
      );
    }

    // Default success response
    return NextResponse.json(
      { 
        status: 'completed',
        message: output,
        operation,
        hookType
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Claude hook API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function extractCO2Impact(output: string): number | null {
  const co2Match = output.match(/CO2 Impact: ([\d.]+) kg CO2e/);
  if (co2Match) {
    return parseFloat(co2Match[1]);
  }
  return null;
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Claude Code Hooks API',
      availableHooks: [
        'pre_tool_use',
        'post_tool_use', 
        'notification',
        'stop',
        'subagent_stop'
      ]
    },
    { status: 200 }
  );
} 