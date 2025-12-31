import path from 'node:path';
import fs from 'node:fs/promises';
import sendResponse from './sendResponse.js';

export default async function priceAPIHandler(req, res) {
	//get server price
	const pricePointer = path.join(
		import.meta.dirname,
		'..',
		'data',
		'price.txt'
	);

	if (req.method === 'GET') {
		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'No-Cache');
		res.setHeader('Connection', 'Keep-Alive');

		try {
			//try to send price early
			const serverPrice = Number(await fs.readFile(pricePointer, 'utf-8'));
			console.log(`send cached price: ${serverPrice}`);
			res.write(
				`data: ${JSON.stringify({
					event: 'price-update',
					price: serverPrice,
				})}\n\n`
			);
		} catch (e) {
			console.log('No cached price.');
		}

		setInterval(async () => {
			//get new price and update price.txt
			const newPrice = Math.floor(Math.random() * 2000 + 2000);
			console.log(`price update: ${newPrice}`);
			await fs.writeFile(pricePointer, `${newPrice}`);
			//send to client
			res.write(
				`data: ${JSON.stringify({
					event: 'price-update',
					price: newPrice,
				})}\n\n`
			);
		}, 10000);
	} else if (req.method === 'POST') {
		try {
			// Get body
			let body = '';
			for await (const chunk of req) {
				body += chunk;
			}
			const parsedBody = JSON.parse(body);
			const serverPrice = Number(await fs.readFile(pricePointer, 'utf-8'));

			if (parsedBody.price === serverPrice) {
				const purchases = path.join(
					import.meta.dirname,
					'..',
					'data',
					'purchases.txt'
				);
				try {
					//create purchase
					const dateObj = new Date();
					const time = dateObj.toLocaleString('en-us');
					const price = serverPrice;
					const amountPaid = parsedBody.amount;
					const amountSold = price / amountPaid;
					const payload = JSON.stringify({
						amount: amountPaid,
						price: price,
						amountSold: amountSold,
						time: time,
					});
					console.log(payload);
					//log and send response
					await fs.appendFile(purchases, `${payload}\n`);
					sendResponse(res, 201, 'application/json', payload);
				} catch (e) {
					console.log(e);
					sendResponse(res, 500, 'application/json', e);
				}
			} else {
				throw new Error('User price outdated!');
			}
		} catch (e) {
			console.log(e);
			sendResponse(res, 400, 'application/json', `${e}`);
		}
	}
}
