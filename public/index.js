const eventSource = new EventSource('/api');
const priceDisplay = document.getElementById('price-display');
const investmentSummary = document.getElementById('investment-summary');
const dialogue = investmentSummary.parentElement;

let price = -1;

//Get price
eventSource.onmessage = (e) => {
	price = JSON.parse(e.data).price;
	priceDisplay.innerText = price;
};

//Submit handler
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
			dialogue.children[1].textContent = `You just bought ${json.amountSold} ounces (ozt) for £${json.amount}. You will recieve documentation shortly.`;
			dialogue.style.display = 'block';
		} catch (e) {
			console.log(e);
		}
	}
});

//Close modal
dialogue.children[2].addEventListener('click', (e) => {
	dialogue.style.display = 'none';
});
