const eventSource = new EventSource('/api');
const priceDisplay = document.getElementById('price-display');
const investmentSummary = document.getElementById('investment-summary');
const dialogue = investmentSummary.parentElement;
console.log(investmentSummary, dialogue);

let price = -1;

eventSource.onmessage = (e) => {
	price = JSON.parse(e.data).price;
	priceDisplay.innerText = price;
};

document.forms[0].addEventListener('submit', async (e) => {
	e.preventDefault();
	if (price == -1) {
		console.log('No price.');
	} else {
		const requestBody = { amount: document.forms[0][0].value, price: price };
		console.log(JSON.stringify(requestBody));
		try {
			const res = await fetch('/api', {
				method: 'POST',
				body: JSON.stringify(requestBody),
			});
			const json = await res.json();
			console.log(json);
		} catch (e) {
			console.log(e);
		}
	}
});
