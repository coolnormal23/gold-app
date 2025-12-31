import fs from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime-types';
import sendResponse from './sendResponse.js';

export default async function serveStatic(req, res, basedir) {
	const url = req.url === '/' ? '/index.html' : req.url;
	// console.log(url);
	const resourcePath = path.join(basedir, 'public', url);
	const mimeType = mime.lookup(resourcePath);
	console.log(`Serving ${resourcePath}, type ${mimeType}`);
	try {
		const payload = await fs.readFile(resourcePath, 'utf-8');
		return sendResponse(res, 200, mimeType, payload);
	} catch (e) {
		console.log(e);
		if (e === 'EONOENT') {
			const payload = await fs.readFile(
				path.join(basedir, 'public', '404.html')
			);
			return sendResponse(res, 404, 'text/html', payload);
		} else {
			return sendResponse(res, 500, 'application/json', `Server error: ${e}`);
		}
	}
}
