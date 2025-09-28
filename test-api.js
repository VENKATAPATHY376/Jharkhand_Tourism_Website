// Quick test for API connection
console.log('Testing API connection...');

const API_BASE_URL = 'http://localhost:5000/api';

// Test API health endpoint
fetch(`${API_BASE_URL}/health`)
  .then(response => response.json())
  .then(data => {
    console.log('✅ API Health Check:', data);
  })
  .catch(error => {
    console.error('❌ API Health Check Failed:', error);
  });

// Test tourism search endpoint
fetch(`${API_BASE_URL}/tourism/search?q=best places to visit`)
  .then(response => response.json())
  .then(data => {
    console.log('✅ Tourism Search Test:', data);
  })
  .catch(error => {
    console.error('❌ Tourism Search Failed:', error);
  });

// Test featured packages endpoint
fetch(`${API_BASE_URL}/packages/featured`)
  .then(response => response.json())
  .then(data => {
    console.log('✅ Featured Packages Test:', data);
  })
  .catch(error => {
    console.error('❌ Featured Packages Failed:', error);
  });