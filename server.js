import path from 'node:path';
import http from 'node:http';
import sendResponse from './utils/sendResponse.js';
import serveStatic from './utils/serveStatic.js';

const PORT = 8000;
const __basedir = import.meta.dirname;

const server = http.createServer(async (req, res) => {
	await serveStatic(req, res, __basedir);
});

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
