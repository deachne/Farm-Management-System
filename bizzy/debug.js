// Simple error tracking script
console.log('Debug script loaded');

// Track uncaught errors
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);
  
  // Display error on page
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.bottom = '0';
  errorDiv.style.left = '0';
  errorDiv.style.right = '0';
  errorDiv.style.padding = '10px';
  errorDiv.style.backgroundColor = 'red';
  errorDiv.style.color = 'white';
  errorDiv.style.zIndex = '9999';
  errorDiv.textContent = 'Error: ' + (event.error ? event.error.message : 'Unknown error');
  document.body.appendChild(errorDiv);
});

// Track unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Display error on page
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.bottom = '0';
  errorDiv.style.left = '0';
  errorDiv.style.right = '0';
  errorDiv.style.padding = '10px';
  errorDiv.style.backgroundColor = 'orange';
  errorDiv.style.color = 'white';
  errorDiv.style.zIndex = '9999';
  errorDiv.textContent = 'Promise error: ' + (event.reason ? event.reason.message : 'Unknown promise error');
  document.body.appendChild(errorDiv);
}); 