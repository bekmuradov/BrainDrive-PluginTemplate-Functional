# Integration: [Service/API Name]

**Date Added**: YYYY-MM-DD
**Author**: [Your Name]
**Status**: [Active | Deprecated | In Development]
**Version**: [API/Service version]
**Documentation**: [Link to official docs]

---

## Purpose

### What This Integration Does
Clear description of what this service/API provides:
- Capability 1
- Capability 2
- Capability 3

### Why We Use It
Business or technical reason for this integration:
- Reason 1
- Reason 2

---

## Authentication

### Method
**Type**: [API Key | OAuth 2.0 | JWT | Basic Auth | None]

### Setup
```javascript
// Code example showing authentication setup
const client = new ServiceClient({
  apiKey: process.env.SERVICE_API_KEY,
  // other config
});
```

### Credentials Location
- **Development**: Location of dev credentials
- **Production**: Location of prod credentials
- **Environment Variables**: List required env vars

---

## Configuration

### Required Settings
```javascript
{
  "apiKey": "string (required)",
  "endpoint": "string (required, default: https://api.service.com)",
  "timeout": "number (optional, default: 30000)",
  "retryAttempts": "number (optional, default: 3)"
}
```

### Optional Settings
```javascript
{
  "enableLogging": "boolean (default: false)",
  "customHeader": "string (optional)"
}
```

---

## Data Format & Schema

### Request Format
```javascript
// Example request structure
{
  "field1": "value",
  "field2": 123,
  "nestedObject": {
    "subField": "value"
  }
}
```

### Response Format
```javascript
// Example response structure
{
  "success": true,
  "data": {
    "id": "abc123",
    "result": "value"
  },
  "metadata": {
    "timestamp": "2025-01-14T10:00:00Z"
  }
}
```

### Data Types
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| field1 | string | Yes | Description |
| field2 | number | No | Description |

---

## Usage Examples

### Basic Usage
```javascript
// Simple example
import { useAPI } from './hooks';

const MyComponent = ({ services }) => {
  const { get, data, loading, error } = useAPI(services.api);

  useEffect(() => {
    get('/api/service-endpoint');
  }, []);

  return <div>{JSON.stringify(data)}</div>;
};
```

### Advanced Usage
```javascript
// Complex example with error handling
const advancedExample = async () => {
  try {
    const response = await services.api.post('/api/service-endpoint', {
      param1: 'value1',
      param2: 'value2'
    });

    if (response.success) {
      return response.data;
    }
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
};
```

---

## Quirks & Gotchas

### Quirk 1: [Name]
**Behavior**: What's unexpected

**Impact**: How it affects usage

**Workaround**:
```javascript
// Code showing how to work around this quirk
```

---

### Quirk 2: [Name]
**Behavior**: What's unexpected

**Impact**: How it affects usage

**Workaround**:
```javascript
// Code showing how to work around this quirk
```

---

## Error Handling

### Common Errors

#### Error 1: `ERROR_CODE_NAME`
- **Cause**: Why this error occurs
- **HTTP Status**: 400/401/403/404/500/etc.
- **Resolution**: How to fix it
- **Retry**: Yes/No

#### Error 2: `ANOTHER_ERROR_CODE`
- **Cause**: Why this error occurs
- **HTTP Status**: 400/401/403/404/500/etc.
- **Resolution**: How to fix it
- **Retry**: Yes/No

### Error Handling Pattern
```javascript
// Recommended error handling approach
try {
  const result = await serviceCall();
  return result;
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Wait and retry
    await delay(error.retryAfter * 1000);
    return serviceCall();
  }

  if (error.code === 'AUTH_FAILED') {
    // Re-authenticate
    await refreshAuth();
    return serviceCall();
  }

  // Log and escalate
  console.error('Service error:', error);
  throw error;
}
```

---

## Rate Limits & Quotas

### Limits
- **Requests per second**: X
- **Requests per day**: Y
- **Concurrent connections**: Z
- **Data transfer**: W MB/day

### Handling Rate Limits
```javascript
// Code example for rate limit handling
// Include retry logic, backoff strategy
```

---

## Scope & Boundaries

### What This Integration Handles
✅ Responsibility 1
✅ Responsibility 2
✅ Responsibility 3

### What This Integration Does NOT Handle
❌ Out of scope 1
❌ Out of scope 2
❌ Out of scope 3

### Related Integrations
If multiple services work together:
- **Service A**: Handles X, passes data to this service
- **Service B**: Receives data from this service, does Y

---

## Testing

### Testing in Development
```javascript
// How to test locally
// Mock setup, test data, etc.
```

### Mocking This Service
```javascript
// Mock implementation for unit tests
const mockService = {
  method1: jest.fn().mockResolvedValue({ success: true, data: {} }),
  method2: jest.fn().mockResolvedValue({ success: true, data: {} }),
};
```

---

## Performance Considerations

### Typical Response Times
- **Fast operations** (<100ms): Operation types
- **Medium operations** (100ms-1s): Operation types
- **Slow operations** (>1s): Operation types

### Optimization Tips
1. **Tip 1**: Description
2. **Tip 2**: Description
3. **Tip 3**: Description

### Caching Strategy
```javascript
// Recommended caching approach
// TTL, cache keys, invalidation strategy
```

---

## Monitoring & Logging

### What to Log
- **Info**: Successful requests, operation types
- **Warn**: Retries, fallbacks, deprecation warnings
- **Error**: Failed requests, auth failures, timeouts

### Metrics to Track
- Request count
- Error rate
- Response time (p50, p95, p99)
- Rate limit usage

---

## Migration & Deprecation

### Version History
- **v1.0.0**: Initial implementation (YYYY-MM-DD)
- **v1.1.0**: Added feature X (YYYY-MM-DD)
- **v2.0.0**: Breaking change - migrated to new endpoint (YYYY-MM-DD)

### Deprecation Plan (if applicable)
- **Deprecation Date**: When this integration will be deprecated
- **Replacement**: What replaces it
- **Migration Path**: How to migrate

---

## Related Documentation

- [Official API docs]
- [Internal ADR if decision was made]
- [Related data quirks]
- [Related failure logs]

---

## Developer Checklist

When using this integration:

**Before implementation:**
- [ ] Read official documentation
- [ ] Verify authentication setup
- [ ] Check rate limits for your use case
- [ ] Review quirks and gotchas section

**During implementation:**
- [ ] Use provided code examples
- [ ] Implement proper error handling
- [ ] Add retry logic for transient failures
- [ ] Log requests and errors appropriately

**After implementation:**
- [ ] Test error scenarios (auth failure, rate limit, timeout)
- [ ] Verify no credentials in code/logs
- [ ] Document any new quirks discovered
- [ ] Update this doc if integration changes

---

## Usage Instructions

To document a new integration:

1. Copy this template:
   ```bash
   cp docs/integrations/000-template.md docs/integrations/service-name.md
   ```

2. When to create integration docs:
   - Connected to new external API
   - Integrated third-party service
   - Created wrapper around vendor SDK
   - Set up authentication with external system

3. Focus on practical usage:
   - Working code examples
   - Common pitfalls
   - Error handling patterns
   - Performance considerations

4. Keep it updated:
   - Update when API version changes
   - Add new quirks as discovered
   - Document breaking changes
   - Mark deprecated features

**Remember**: Good integration docs prevent repeated authentication issues, API misuse, and rate limit surprises.
