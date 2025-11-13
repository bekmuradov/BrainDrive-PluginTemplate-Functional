import React, { useState, useEffect } from 'react';
import { Services } from '../../../types';
import CodeExample from '../CodeExample';
import TryItButton from '../TryItButton';
import ResultDisplay from '../ResultDisplay';
import './EventServiceTab.css';

interface EventServiceTabProps {
  services: Services;
}

interface Message {
  id: string;
  channel: string;
  content: any;
  timestamp: string;
}

export const EventServiceTab: React.FC<EventServiceTabProps> = ({ services }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channel, setChannel] = useState('demo-channel');
  const [messageContent, setMessageContent] = useState('Hello from Plugin!');
  const [isListening, setIsListening] = useState(false);

  const isAvailable = !!services.event;

  // Subscribe to messages
  useEffect(() => {
    if (!services.event || !isListening) return;

    const handleMessage = (message: any) => {
      const newMessage: Message = {
        id: Math.random().toString(36),
        channel,
        content: message,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [newMessage, ...prev].slice(0, 10)); // Keep last 10
    };

    services.event.subscribeToMessages(channel, handleMessage);

    return () => {
      services.event?.unsubscribeFromMessages(channel, handleMessage);
    };
  }, [services.event, channel, isListening]);

  const sendMessage = () => {
    if (!services.event) return;

    services.event.sendMessage(channel, {
      type: 'TEST_MESSAGE',
      content: messageContent,
      timestamp: Date.now()
    });
  };

  if (!isAvailable) {
    return (
      <div className="event-service-tab">
        <div className="service-unavailable">
          <h3>⚠️ Event Service Unavailable</h3>
          <p>The event service is not available in this environment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-service-tab">
      <div className="showcase-intro">
        <h2>📡 Event Service - Inter-Plugin Communication</h2>
        <p>
          The Event Service enables plugins to communicate with each other through a message bus.
          Send messages to specific channels and subscribe to receive messages from other plugins.
        </p>
      </div>

      {/* Example 1: Send Message */}
      <div className="showcase-example">
        <h3>Example 1: Send Messages</h3>
        <p>Broadcast messages to other plugins listening on the same channel.</p>

        <div className="demo-section">
          <div className="form-group">
            <label>Channel Name:</label>
            <input
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="demo-input"
              placeholder="demo-channel"
            />
          </div>

          <div className="form-group">
            <label>Message Content:</label>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="demo-textarea"
              rows={3}
              placeholder="Enter your message..."
            />
          </div>

          <TryItButton
            onClick={sendMessage}
            label="Send Message"
            icon="📤"
            variant="primary"
          />
        </div>

        <CodeExample
          title="Send a message"
          code={`
services.event?.sendMessage('my-channel', {
  type: 'DATA_UPDATE',
  data: { id: 123, value: 'new data' },
  timestamp: Date.now()
});
          `}
        />
      </div>

      {/* Example 2: Subscribe to Messages */}
      <div className="showcase-example">
        <h3>Example 2: Subscribe to Messages</h3>
        <p>Listen for messages on a specific channel.</p>

        <div className="demo-section">
          <div className="subscribe-control">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={isListening}
                onChange={(e) => setIsListening(e.target.checked)}
                className="toggle-checkbox"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                {isListening ? `Listening on "${channel}"` : 'Not listening'}
              </span>
            </label>
          </div>

          <div className="message-feed">
            <h4>📨 Received Messages ({messages.length})</h4>
            {messages.length === 0 ? (
              <p className="empty-state">
                No messages yet. {isListening ? `Send a message to "${channel}" to see it here.` : 'Enable listening to receive messages.'}
              </p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="message-card">
                  <div className="message-header">
                    <span className="message-channel">#{msg.channel}</span>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                  <pre className="message-content">{JSON.stringify(msg.content, null, 2)}</pre>
                </div>
              ))
            )}
          </div>
        </div>

        <CodeExample
          title="Subscribe to messages"
          code={`
useEffect(() => {
  if (!services.event) return;

  const handleMessage = (message: any) => {
    console.log('Received message:', message);
    // Handle the message
  };

  // Subscribe
  services.event.subscribeToMessages('my-channel', handleMessage);

  // Cleanup on unmount
  return () => {
    services.event?.unsubscribeFromMessages('my-channel', handleMessage);
  };
}, [services.event]);
          `}
        />
      </div>

      {/* Example 3: Request-Response Pattern */}
      <div className="showcase-example">
        <h3>Example 3: Request-Response Pattern</h3>
        <p>Implement request-response patterns for plugin coordination.</p>

        <CodeExample
          title="Request-response pattern"
          code={`
// Plugin A: Send request and wait for response
const requestData = () => {
  const requestId = Math.random().toString(36);
  const responseChannel = \`response-\${requestId}\`;

  // Listen for response
  const handleResponse = (response: any) => {
    console.log('Got response:', response);
    services.event?.unsubscribeFromMessages(responseChannel, handleResponse);
  };

  services.event?.subscribeToMessages(responseChannel, handleResponse);

  // Send request
  services.event?.sendMessage('data-requests', {
    type: 'REQUEST_DATA',
    requestId,
    responseChannel,
    query: 'latest-posts'
  });

  // Set timeout to cleanup
  setTimeout(() => {
    services.event?.unsubscribeFromMessages(responseChannel, handleResponse);
  }, 5000);
};

// Plugin B: Listen for requests and respond
useEffect(() => {
  const handleRequest = (request: any) => {
    if (request.type === 'REQUEST_DATA') {
      // Process request
      const responseData = { posts: [...] };

      // Send response back
      services.event?.sendMessage(request.responseChannel, {
        type: 'RESPONSE',
        requestId: request.requestId,
        data: responseData
      });
    }
  };

  services.event?.subscribeToMessages('data-requests', handleRequest);

  return () => {
    services.event?.unsubscribeFromMessages('data-requests', handleRequest);
  };
}, []);
          `}
        />
      </div>

      {/* Best Practices */}
      <div className="showcase-tips">
        <h3>💡 Best Practices</h3>
        <ul>
          <li><strong>Use unique channels:</strong> Prefix channels with your plugin name</li>
          <li><strong>Always unsubscribe:</strong> Clean up listeners in useEffect return function</li>
          <li><strong>Message structure:</strong> Include type, timestamp, and sender info</li>
          <li><strong>Timeout requests:</strong> Don't wait forever for responses</li>
          <li><strong>Validate messages:</strong> Check message structure before processing</li>
          <li><strong>Document channels:</strong> Let other plugins know what channels you expose</li>
        </ul>
      </div>
    </div>
  );
};

export default EventServiceTab;
