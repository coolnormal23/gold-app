import http from 'node:http';
import sendResponse from './utils/sendResponse.js';

const PORT = 8000;

const server = http.createServer((req, res) => {
  sendResponse(res, 200, 'text/html', `<h1>Hello from the server</h1>`);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
