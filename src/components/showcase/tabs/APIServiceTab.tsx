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
 * Demonstrates API service with real HTTP requests.
 * Shows GET, POST, PUT, DELETE operations with working examples.
 */
export const APIServiceTab: React.FC<APIServiceTabProps> = ({ services, errorHandler }) => {
  const { get, post, put, delete: del, data, loading, error, isAvailable, clearError } = useAPI(services.api, errorHandler);

  const [postData, setPostData] = useState({ title: 'Test Post', body: 'This is a test', userId: 1 });
  const [putData, setPutData] = useState({ title: 'Updated Title', body: 'Updated content', userId: 1 });

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
        <h2>🌐 API Service - Connect to Your Backend</h2>
        <p>
          The API Service provides authenticated HTTP requests to the BrainDrive backend.
          Make GET, POST, PUT, and DELETE requests with automatic error handling and loading states.
        </p>
      </div>

      {/* Example 1: GET Request */}
      <div className="showcase-example">
        <h3>Example 1: GET Request</h3>
        <p>Fetch data from an endpoint. This example uses JSONPlaceholder, a free test API.</p>

        <div className="demo-section">
          <div className="button-group">
            <TryItButton
              onClick={async () => {
                clearError();
                await get('https://jsonplaceholder.typicode.com/posts/1');
              }}
              label="GET /posts/1"
              icon="📥"
              variant="primary"
              loading={loading}
            />
            <TryItButton
              onClick={async () => {
                clearError();
                await get('https://jsonplaceholder.typicode.com/users/1');
              }}
              label="GET /users/1"
              icon="👤"
              variant="secondary"
              loading={loading}
            />
          </div>

          <ResultDisplay
            title="Response Data"
            data={data}
            error={error}
            loading={loading}
            empty="Click a button above to make a GET request"
          />
        </div>

        <CodeExample
          title="Using the useAPI hook for GET requests"
          code={`
import { useAPI } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { get, data, loading, error } = useAPI(services.api);

  const fetchPost = async () => {
    await get('/api/posts/1');
  };

  useEffect(() => {
    fetchPost(); // Fetch on mount
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return <div>{JSON.stringify(data)}</div>;
};
          `}
        />
      </div>

      {/* Example 2: POST Request */}
      <div className="showcase-example">
        <h3>Example 2: POST Request</h3>
        <p>Create new data by sending a POST request with a payload.</p>

        <div className="demo-section">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={postData.title}
              onChange={(e) => setPostData({ ...postData, title: e.target.value })}
              className="demo-input"
            />
          </div>
          <div className="form-group">
            <label>Body:</label>
            <textarea
              value={postData.body}
              onChange={(e) => setPostData({ ...postData, body: e.target.value })}
              className="demo-textarea"
              rows={3}
            />
          </div>

          <TryItButton
            onClick={async () => {
              clearError();
              await post('https://jsonplaceholder.typicode.com/posts', postData);
            }}
            label="Create Post"
            icon="➕"
            variant="success"
            loading={loading}
          />

          <ResultDisplay
            title="Response Data"
            data={data}
            error={error}
            loading={loading}
            empty="Fill the form and click 'Create Post' to see the result"
            variant={data ? 'success' : 'default'}
          />
        </div>

        <CodeExample
          title="POST request with data"
          code={`
const { post, data, loading, error } = useAPI(services.api);

const createPost = async () => {
  const newPost = {
    title: 'My New Post',
    body: 'Post content here',
    userId: 1
  };

  await post('/api/posts', newPost);

  if (data) {
    console.log('Created post:', data);
  }
};
          `}
        />
      </div>

      {/* Example 3: PUT Request */}
      <div className="showcase-example">
        <h3>Example 3: PUT Request</h3>
        <p>Update existing data with a PUT request.</p>

        <div className="demo-section">
          <div className="form-group">
            <label>Updated Title:</label>
            <input
              type="text"
              value={putData.title}
              onChange={(e) => setPutData({ ...putData, title: e.target.value })}
              className="demo-input"
            />
          </div>
          <div className="form-group">
            <label>Updated Body:</label>
            <textarea
              value={putData.body}
              onChange={(e) => setPutData({ ...putData, body: e.target.value })}
              className="demo-textarea"
              rows={3}
            />
          </div>

          <TryItButton
            onClick={async () => {
              clearError();
              await put('https://jsonplaceholder.typicode.com/posts/1', putData);
            }}
            label="Update Post"
            icon="✏️"
            variant="primary"
            loading={loading}
          />

          <ResultDisplay
            title="Response Data"
            data={data}
            error={error}
            loading={loading}
            empty="Fill the form and click 'Update Post' to see the result"
            variant={data ? 'info' : 'default'}
          />
        </div>

        <CodeExample
          title="PUT request to update data"
          code={`
const { put } = useAPI(services.api);

const updatePost = async (postId: number) => {
  const updatedData = {
    title: 'Updated Title',
    body: 'Updated content',
    userId: 1
  };

  await put(\`/api/posts/\${postId}\`, updatedData);
};
          `}
        />
      </div>

      {/* Example 4: DELETE Request */}
      <div className="showcase-example">
        <h3>Example 4: DELETE Request</h3>
        <p>Delete data with a DELETE request.</p>

        <div className="demo-section">
          <TryItButton
            onClick={async () => {
              clearError();
              const result = await del('https://jsonplaceholder.typicode.com/posts/1');
              if (result) {
                console.log('Delete successful!');
              }
            }}
            label="Delete Post"
            icon="🗑️"
            variant="danger"
            loading={loading}
          />

          <ResultDisplay
            title="Response"
            data={data === null ? 'Delete successful! (returns empty response)' : data}
            error={error}
            loading={loading}
            empty="Click 'Delete Post' to test delete operation"
          />
        </div>

        <CodeExample
          title="DELETE request"
          code={`
const { delete: del } = useAPI(services.api);

const deletePost = async (postId: number) => {
  const success = await del(\`/api/posts/\${postId}\`);

  if (success) {
    console.log('Post deleted successfully');
    // Update UI to remove the item
  }
};
          `}
        />
      </div>

      {/* Example 5: Error Handling */}
      <div className="showcase-example">
        <h3>Example 5: Error Handling</h3>
        <p>See how the API service handles errors gracefully.</p>

        <div className="demo-section">
          <TryItButton
            onClick={async () => {
              clearError();
              // This will fail - invalid endpoint
              await get('https://jsonplaceholder.typicode.com/invalid-endpoint');
            }}
            label="Trigger Error"
            icon="⚠️"
            variant="danger"
            loading={loading}
          />

          <ResultDisplay
            title="Error Response"
            data={data}
            error={error}
            loading={loading}
            empty="Click 'Trigger Error' to see error handling"
            variant={error ? 'error' : 'default'}
          />

          <p className="demo-hint">
            💡 <strong>Note:</strong> The hook automatically captures errors and provides user-friendly messages.
            Check the browser console for detailed error logs.
          </p>
        </div>

        <CodeExample
          title="Error handling"
          code={`
const { get, error, clearError } = useAPI(services.api);

const fetchData = async () => {
  clearError(); // Clear previous errors
  await get('/api/data');
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

      {/* Real BrainDrive Endpoints */}
      <div className="showcase-example">
        <h3>Example 6: Real BrainDrive Endpoints</h3>
        <p>
          When integrated with BrainDrive, you can access real backend endpoints.
          Here are common endpoints you might use:
        </p>

        <div className="endpoint-list">
          <div className="endpoint-card">
            <span className="endpoint-method method-get">GET</span>
            <code>/api/collections</code>
            <p>List all collections</p>
          </div>
          <div className="endpoint-card">
            <span className="endpoint-method method-get">GET</span>
            <code>/api/collections/:id</code>
            <p>Get a specific collection</p>
          </div>
          <div className="endpoint-card">
            <span className="endpoint-method method-post">POST</span>
            <code>/api/collections</code>
            <p>Create a new collection</p>
          </div>
          <div className="endpoint-card">
            <span className="endpoint-method method-put">PUT</span>
            <code>/api/collections/:id</code>
            <p>Update a collection</p>
          </div>
          <div className="endpoint-card">
            <span className="endpoint-method method-delete">DELETE</span>
            <code>/api/collections/:id</code>
            <p>Delete a collection</p>
          </div>
        </div>

        <CodeExample
          title="Example: Fetching BrainDrive collections"
          code={`
const { get } = useAPI(services.api);

// Fetch all collections
const loadCollections = async () => {
  const response = await get('/api/collections');
  console.log('Collections:', response);
};

// Fetch specific collection
const loadCollection = async (id: string) => {
  const response = await get(\`/api/collections/\${id}\`);
  console.log('Collection:', response);
};
          `}
        />
      </div>

      {/* Best Practices */}
      <div className="showcase-tips">
        <h3>💡 Best Practices</h3>
        <ul>
          <li>
            <strong>Use the hook:</strong> <code>useAPI</code> provides automatic state management
          </li>
          <li>
            <strong>Handle loading states:</strong> Show spinners or skeleton screens while <code>loading</code> is true
          </li>
          <li>
            <strong>Display errors:</strong> Always show <code>error</code> messages to users
          </li>
          <li>
            <strong>Clear errors:</strong> Call <code>clearError()</code> before new requests
          </li>
          <li>
            <strong>Use async/await:</strong> Makes code more readable than promises
          </li>
          <li>
            <strong>Check isAvailable:</strong> Verify service exists before using
          </li>
          <li>
            <strong>Authentication:</strong> The API service handles auth tokens automatically
          </li>
        </ul>
      </div>
    </div>
  );
};

export default APIServiceTab;
