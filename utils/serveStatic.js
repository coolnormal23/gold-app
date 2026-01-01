import fs from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime-types';
import sendResponse from './sendResponse.js';
import throw404 from './throw404.js';

export default async function serveStatic(req, res, basedir) {
	const url = req.url === '/' ? '/index.html' : req.url;
	if (req.url === '/favicon.ico') {
		console.log('404ing favicon fetch');
		return await throw404(res, basedir);
	}
	const resourcePath = path.join(basedir, 'public', url);
	const mimeType = mime.lookup(resourcePath);
	console.log(`Serving ${resourcePath}, type ${mimeType}`);
	try {
		const payload = await fs.readFile(
			resourcePath,
			mimeType.startsWith('image') ? null : 'utf-8'
		);
		return sendResponse(res, 200, mimeType, payload);
	} catch (e) {
		console.log(e);
		if (e === 'EONOENT') {
			return await throw404(res, basedir);
		} else {
			return sendResponse(res, 500, 'application/json', `Server error: ${e}`);
		}
	}
}
