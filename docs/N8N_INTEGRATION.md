# N8N Integration Configuration

## Environment Variables

Add these to your `.env.local` file:

```bash
# N8N Domain (required)
N8N_DOMAIN=your-n8n-domain.com

# Alternative: Use NEXT_PUBLIC_N8N_DOMAIN for client-side access
NEXT_PUBLIC_N8N_DOMAIN=your-n8n-domain.com

# N8N API Key (optional, for additional security)
N8N_API_KEY=your-n8n-api-key-here
```

## Agent to Workflow ID Mapping

The following agents are configured:

| Agent Name | Workflow ID | Description |
|------------|-------------|-------------|
| `calendar` | `0vBc9gJYA3iJ5sos` | Calendar management workflows |
| `email` | `KLifODuorqjN4a4M` | Email automation workflows |
| `phone` | `pa2wKv0LsdfvSWxn` | Phone call workflows |
| `personal_assistant` | `e0pthxtytY6HYTLO` | General AI assistant workflows |

## Usage Examples

### Using the React Hook

```tsx
import { useTriggerN8nAgent, AGENT_NAMES } from '@/hooks/useTriggerN8nAgent';

function MyComponent() {
  const { data, error, isLoading, trigger } = useTriggerN8nAgent();

  const handleTrigger = async () => {
    await trigger({
      agentName: AGENT_NAMES.EMAIL,
      payload: {
        to: 'user@example.com',
        subject: 'Hello from DecentraMind',
        body: 'This is a test email'
      },
      onSuccess: (data) => console.log('Success:', data),
      onError: (error) => console.error('Error:', error)
    });
  };

  return (
    <button onClick={handleTrigger} disabled={isLoading}>
      {isLoading ? 'Sending...' : 'Send Email'}
    </button>
  );
}
```

### Using the Utility Function

```tsx
import { triggerN8nAgent } from '@/hooks/useTriggerN8nAgent';

const result = await triggerN8nAgent('calendar', {
  action: 'create_event',
  title: 'Meeting',
  startTime: new Date().toISOString()
});

if (result.success) {
  console.log('Calendar event created:', result.data);
} else {
  console.error('Failed:', result.error);
}
```

## API Endpoint

The `/api/n8n/trigger` endpoint accepts POST requests with:

```json
{
  "agentName": "calendar|email|phone|personal_assistant",
  "payload": {
    // Your workflow-specific data
  }
}
```

## Security Features

- Input validation for agent names and payloads
- Request timeout (30 seconds)
- Error handling and logging
- CORS support
- Optional API key authentication
- Request metadata tracking

## Testing

Test the integration by:

1. Setting up your n8n workflows with the correct webhook URLs
2. Configuring the environment variables
3. Using the N8N Agent Trigger component in the AI Console
4. Monitoring the API logs for any issues
