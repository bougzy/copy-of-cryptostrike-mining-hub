
// This script will be converted to a Blob and used as a Web Worker
export const workerScript = `
  let mining = false;
  let hashCount = 0;

  self.onmessage = function(e) {
    if (e.data === 'start') {
      mining = true;
      mine();
    } else if (e.data === 'stop') {
      mining = false;
    }
  };

  async function mine() {
    while (mining) {
      // Perform actual SHA-256 hashing to consume CPU cycles realistically
      const data = new TextEncoder().encode(Math.random().toString() + Date.now());
      await crypto.subtle.digest('SHA-256', data);
      
      hashCount++;
      
      if (hashCount % 100 === 0) {
        self.postMessage({ type: 'progress', count: 100 });
      }
      
      // Prevent UI freezing while still consuming resources
      if (hashCount % 500 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
  }
`;
