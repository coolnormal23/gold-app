import path from 'node:path';
import fs from 'node:fs/promises';
import sendResponse from './sendResponse.js';

export default async function throw404(res, basedir) {
	const payload = await fs.readFile(path.join(basedir, 'public', '404.html'));
	return sendResponse(res, 404, 'text/html', payload);
}
