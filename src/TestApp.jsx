import React from 'react';

const TestApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎯 Jharkhand Tourism - Test Version</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', border: '1px solid #0066cc', borderRadius: '8px' }}>
        <h3>🚀 Test Features:</h3>
        <ul>
          <li>✅ React Component Rendering</li>
          <li>✅ Basic Styling</li>
          <li>✅ Font Loading</li>
        </ul>
      </div>
      <button 
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#0066cc', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button working!')}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestApp;