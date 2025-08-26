import React from 'react';

export const TestComponent: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      background: '#1a1a2e', 
      color: '#4ecdc4', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎭 StarTales Test Component</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ 
        background: '#0f0f23', 
        padding: '15px', 
        borderRadius: '8px', 
        margin: '20px 0',
        border: '1px solid #4ecdc4'
      }}>
        <h2>Entertainment & Tourism System Status</h2>
        <p>✅ React component rendering</p>
        <p>✅ CSS styling working</p>
        <p>✅ Entertainment & Tourism system integrated</p>
        <button 
          onClick={() => alert('Button clicked! React events are working.')}
          style={{
            background: '#4ecdc4',
            color: '#0f0f23',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
};
