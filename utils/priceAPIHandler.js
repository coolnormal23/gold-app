import path from 'node:path';
import fs from 'node:fs/promises';
import sendResponse from './sendResponse.js';

export default async function priceAPIHandler(req, res) {
	if (req.method === 'GET') {
		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'No-Cache');
		res.setHeader('Connection', 'Keep-Alive');

		setInterval(() => {
			const newPrice = Math.floor(Math.random() * 2000 + 2000);
			console.log(`price update: ${newPrice}`);
			res.write(
				`data: ${JSON.stringify({
					event: 'price-update',
					price: newPrice,
				})}\n\n`
			);
		}, 5000);
	} else if (req.method === 'POST') {
		console.log('purchase');
		const purchases = path.join(
			import.meta.dirname,
			'..',
			'data',
			'purchases.txt'
		);
		try {
			await fs.writeFile(purchases, 'purchase');
		} catch (e) {
			console.log(e);
			return;
		}
	}
}
