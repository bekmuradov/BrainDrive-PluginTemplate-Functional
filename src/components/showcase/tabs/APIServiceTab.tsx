import React, { useState } from 'react';
import { Services } from '../../../types';
import { useAPI } from '../../../hooks';
import CodeExample from '../CodeExample';
import TryItButton from '../TryItButton';
import ResultDisplay from '../ResultDisplay';
import { ErrorHandler } from '../../../utils/errorHandling';
import './APIServiceTab.css';

interface APIServiceTabProps {
  services: Services;
  errorHandler: ErrorHandler;
}

/**
 * APIServiceTab Component
 *
 * Demonstrates API service with real BrainDrive HTTP requests.
 * Shows GET, POST, PUT, DELETE operations with actual backend endpoints.
 */
export const APIServiceTab: React.FC<APIServiceTabProps> = ({ services, errorHandler }) => {
  const { get, post, put, delete: del, data, loading, error, isAvailable, clearError } = useAPI(services.api, errorHandler);

  // Tag creation/update form data
  const [tagName, setTagName] = useState('Demo Tag');
  const [tagColor, setTagColor] = useState('#9B59B6');
  const [tagId, setTagId] = useState('');

  if (!isAvailable) {
    return (
      <div className="api-service-tab">
        <div className="service-unavailable">
          <h3>⚠️ API Service Unavailable</h3>
          <p>The API service is not available in this environment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="api-service-tab">
      {/* Introduction */}
      <div className="showcase-intro">
        <h2>🌐 API Service - Connect to BrainDrive Backend</h2>
        <p>
          The API Service provides authenticated HTTP requests to the BrainDrive backend.
          These examples use real BrainDrive API endpoints that are safe for testing and demonstrations.
        </p>
      </div>

      {/* Example 1: GET Request - Fetch AI Models */}
      <div className="showcase-example">
        <h3>Example 1: GET Request - Fetch AI Models</h3>
        <p>Retrieve the list of available AI models. This is a read-only, safe endpoint.</p>

        <div className="demo-section">
          <div className="button-group">
            <TryItButton
              onClick={async () => {
                clearError();
                await get('/api/v1/ai/providers/all-models');
              }}
              label="GET AI Models"
              icon="🤖"
              variant="primary"
              loading={loading}
            />
          </div>

          <ResultDisplay
            title="Response Data"
            data={data}
            error={error}
            loading={loading}
            empty="Click the button above to fetch AI models"
          />

          <div className="api-info">
            <strong>Endpoint:</strong> <code>GET /api/v1/ai/providers/all-models</code>
          </div>
        </div>

        <CodeExample
          title="Fetch AI models"
          code={`
import { useAPI } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { get, data, loading, error } = useAPI(services.api);

  const fetchModels = async () => {
    await get('/api/v1/ai/providers/all-models');
  };

  useEffect(() => {
    fetchModels(); // Fetch on mount
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      <h3>Available Models: {data?.models?.length}</h3>
      {data?.models?.map(model => (
        <div key={model.id}>
          {model.name} - {model.provider}
        </div>
      ))}
    </div>
  );
};
          `}
        />
      </div>

      {/* Example 2: GET Request - List User Tags */}
      <div className="showcase-example">
        <h3>Example 2: GET Request - List User Tags</h3>
        <p>Fetch tags for the current user. User-scoped and safe for demonstration.</p>

        <div className="demo-section">
          <div className="button-group">
            <TryItButton
              onClick={async () => {
                clearError();
                // Note: In real usage, you'd get currentUserId from user context
                // For demo, we'll use the endpoint without user_id parameter
                await get('/api/v1/tags');
              }}
              label="GET User Tags"
              icon="🏷️"
              variant="secondary"
              loading={loading}
            />
          </div>

          <ResultDisplay
            title="Response Data"
            data={data}
            error={error}
            loading={loading}
            empty="Click the button to fetch your tags"
          />

          <div className="api-info">
            <strong>Endpoint:</strong> <code>GET /api/v1/tags</code>
          </div>
        </div>

        <CodeExample
          title="Fetch user tags"
          code={`
const { get } = useAPI(services.api);

// Fetch current user's tags
const fetchTags = async () => {
  const response = await get('/api/v1/tags');

  if (response) {
    console.log('User tags:', response);
    // Process tags...
  }
};

// Expected response structure:
// [
//   {
//     "id": "tag-123",
//     "user_id": "user-456",
//     "name": "Important",
//     "color": "#FF5733",
//     "created_at": "2025-01-15T10:30:00Z",
//     "updated_at": "2025-01-15T10:30:00Z"
//   }
// ]
          `}
        />
      </div>

      {/* Example 3: POST Request - Create Tag */}
      <div className="showcase-example">
        <h3>Example 3: POST Request - Create New Tag</h3>
        <p>Create a new tag for the current user. Safe and non-critical operation.</p>

        <div className="demo-section">
          <div className="form-group">
            <label>Tag Name:</label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="demo-input"
              placeholder="Enter tag name"
            />
          </div>
          <div className="form-group">
            <label>Tag Color:</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="demo-color-input"
              />
              <input
                type="text"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="demo-input"
                placeholder="#9B59B6"
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <TryItButton
            onClick={async () => {
              clearError();
              const response = await post('/api/v1/tags', {
                name: tagName,
                color: tagColor
              });

              // Store the created tag ID for update/delete examples
              if (response && response.id) {
                setTagId(response.id);
              }
            }}
            label="Create Tag"
            icon="➕"
            variant="success"
            loading={loading}
          />

          <ResultDisplay
            title="Response Data"
            data={data}
            error={error}
            loading={loading}
            empty="Fill the form and click 'Create Tag' to see the result"
            variant={data ? 'success' : 'default'}
          />

          <div className="api-info">
            <strong>Endpoint:</strong> <code>POST /api/v1/tags</code>
          </div>
        </div>

        <CodeExample
          title="Create a new tag"
          code={`
const { post, data, loading, error } = useAPI(services.api);

const createTag = async () => {
  const newTag = {
    name: "Demo Tag",
    color: "#9B59B6"
  };

  const response = await post('/api/v1/tags', newTag);

  if (response) {
    console.log('Created tag:', response);
    // Response includes:
    // - id: generated tag ID
    // - user_id: automatically set from current user
    // - name, color: your values
    // - created_at: timestamp
  }
};

// Handle validation errors
if (error) {
  // Error format:
  // {
  //   "detail": [
  //     {
  //       "loc": ["body", "name"],
  //       "msg": "field required",
  //       "type": "value_error.missing"
  //     }
  //   ]
  // }
}
          `}
        />
      </div>

      {/* Example 4: PUT Request - Update Tag */}
      <div className="showcase-example">
        <h3>Example 4: PUT Request - Update Tag</h3>
        <p>Update an existing tag. You need to create a tag first to get its ID.</p>

        <div className="demo-section">
          {tagId && (
            <div className="demo-hint" style={{ marginBottom: '16px' }}>
              💡 <strong>Tag ID ready:</strong> {tagId} - You can now update this tag!
            </div>
          )}

          <div className="form-group">
            <label>Tag ID:</label>
            <input
              type="text"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              className="demo-input"
              placeholder="Create a tag first or enter tag ID"
            />
          </div>
          <div className="form-group">
            <label>Updated Name:</label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="demo-input"
            />
          </div>
          <div className="form-group">
            <label>Updated Color:</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="demo-color-input"
              />
              <input
                type="text"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="demo-input"
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <TryItButton
            onClick={async () => {
              if (!tagId) {
                alert('Please create a tag first or enter a tag ID');
                return;
              }
              clearError();
              await put(`/api/v1/tags/${tagId}`, {
                name: tagName,
                color: tagColor
              });
            }}
            label="Update Tag"
            icon="✏️"
            variant="primary"
            loading={loading}
            disabled={!tagId}
          />

          <ResultDisplay
            title="Response Data"
            data={data}
            error={error}
            loading={loading}
            empty="Create or enter a tag ID, then update it"
            variant={data ? 'info' : 'default'}
          />

          <div className="api-info">
            <strong>Endpoint:</strong> <code>PUT /api/v1/tags/&#123;tag_id&#125;</code>
          </div>
        </div>

        <CodeExample
          title="Update an existing tag"
          code={`
const { put } = useAPI(services.api);

const updateTag = async (tagId: string) => {
  const updatedData = {
    name: "Updated Demo Tag",
    color: "#E74C3C"
  };

  const response = await put(\`/api/v1/tags/\${tagId}\`, updatedData);

  if (response) {
    console.log('Updated tag:', response);
    // Response includes updated_at timestamp
  }
};

// Response structure:
// {
//   "id": "tag-125",
//   "user_id": "user-456",
//   "name": "Updated Demo Tag",
//   "color": "#E74C3C",
//   "created_at": "2025-01-15T11:45:00Z",
//   "updated_at": "2025-01-15T12:00:00Z"  // New timestamp
// }
          `}
        />
      </div>

      {/* Example 5: DELETE Request */}
      <div className="showcase-example">
        <h3>Example 5: DELETE Request - Remove Tag</h3>
        <p>Delete a tag. Safe operation - only affects user-scoped tags.</p>

        <div className="demo-section">
          <div className="form-group">
            <label>Tag ID to Delete:</label>
            <input
              type="text"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              className="demo-input"
              placeholder="Enter tag ID"
            />
          </div>

          <TryItButton
            onClick={async () => {
              if (!tagId) {
                alert('Please enter a tag ID to delete');
                return;
              }
              if (!confirm(`Are you sure you want to delete tag ${tagId}?`)) {
                return;
              }
              clearError();
              const result = await del(`/api/v1/tags/${tagId}`);
              if (result !== false) {
                console.log('Delete successful!');
                setTagId(''); // Clear the ID after deletion
              }
            }}
            label="Delete Tag"
            icon="🗑️"
            variant="danger"
            loading={loading}
            disabled={!tagId}
          />

          <ResultDisplay
            title="Response"
            data={data === null && !error && !loading ? 'Delete successful! (Status: 204 No Content)' : data}
            error={error}
            loading={loading}
            empty="Enter a tag ID and click 'Delete Tag'"
          />

          <div className="api-info">
            <strong>Endpoint:</strong> <code>DELETE /api/v1/tags/&#123;tag_id&#125;</code>
          </div>
        </div>

        <CodeExample
          title="Delete a tag"
          code={`
const { delete: del } = useAPI(services.api);

const deleteTag = async (tagId: string) => {
  // Confirm before deleting
  if (!confirm('Are you sure?')) return;

  const success = await del(\`/api/v1/tags/\${tagId}\`);

  if (success) {
    console.log('Tag deleted successfully');
    // Response is 204 No Content (empty)
    // Update UI to remove the item
  }
};
          `}
        />
      </div>

      {/* Example 6: Error Handling */}
      <div className="showcase-example">
        <h3>Example 6: Error Handling</h3>
        <p>See how the API service handles different types of errors gracefully.</p>

        <div className="demo-section">
          <div className="button-group">
            <TryItButton
              onClick={async () => {
                clearError();
                // This will return 404 - Tag not found
                await get('/api/v1/tags/invalid-tag-id-12345');
              }}
              label="Trigger 404 Error"
              icon="⚠️"
              variant="danger"
              loading={loading}
            />
            <TryItButton
              onClick={async () => {
                clearError();
                // This will return 422 - Validation error (missing name)
                await post('/api/v1/tags', { color: '#FF5733' });
              }}
              label="Trigger Validation Error"
              icon="❌"
              variant="danger"
              loading={loading}
            />
          </div>

          <ResultDisplay
            title="Error Response"
            data={data}
            error={error}
            loading={loading}
            empty="Click a button to see error handling"
            variant={error ? 'error' : 'default'}
          />

          <p className="demo-hint">
            💡 <strong>Note:</strong> The hook automatically captures errors and provides user-friendly messages.
            Check the browser console for detailed error logs.
          </p>
        </div>

        <CodeExample
          title="Error handling patterns"
          code={`
const { get, post, error, clearError } = useAPI(services.api);

// Example 1: 404 Error
const fetchTag = async (tagId: string) => {
  clearError(); // Clear previous errors
  const result = await get(\`/api/v1/tags/\${tagId}\`);

  if (!result && error) {
    // Error format:
    // { "detail": "Tag not found" }
    console.error('Tag not found:', error);
  }
};

// Example 2: 422 Validation Error
const createTag = async () => {
  clearError();
  const result = await post('/api/v1/tags', {
    color: '#FF5733'  // Missing required 'name' field
  });

  if (!result && error) {
    // Error format:
    // {
    //   "detail": [
    //     {
    //       "loc": ["body", "name"],
    //       "msg": "field required",
    //       "type": "value_error.missing"
    //     }
    //   ]
    // }
    console.error('Validation error:', error);
  }
};

// Display error to user
{error && (
  <div className="error-message">
    <p>{error}</p>
    <button onClick={clearError}>Dismiss</button>
  </div>
)}
          `}
        />
      </div>

      {/* Best Practices */}
      <div className="showcase-tips">
        <h3>💡 Best Practices</h3>
        <ul>
          <li>
            <strong>Use the hook:</strong> <code>useAPI</code> provides automatic state management and error handling
          </li>
          <li>
            <strong>Handle loading states:</strong> Show spinners or skeleton screens while <code>loading</code> is true
          </li>
          <li>
            <strong>Display errors:</strong> Always show <code>error</code> messages to users with actionable feedback
          </li>
          <li>
            <strong>Clear errors:</strong> Call <code>clearError()</code> before new requests to reset error state
          </li>
          <li>
            <strong>Use async/await:</strong> Makes code more readable than promise chains
          </li>
          <li>
            <strong>Check responses:</strong> Validate response structure before using data
          </li>
          <li>
            <strong>Authentication:</strong> The API service handles auth tokens automatically - no manual headers needed
          </li>
          <li>
            <strong>User confirmation:</strong> Always confirm before DELETE operations
          </li>
          <li>
            <strong>Validation:</strong> Validate form data before sending to prevent 422 errors
          </li>
        </ul>
      </div>
    </div>
  );
};

export default APIServiceTab;
