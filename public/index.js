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

document.forms[0].addEventListener('submit', (e) => {
	e.preventDefault();
	if (price == -1) {
		console.log('No price.');
	} else {
		console.log(`bought gold: ${document.forms[0][0].value}`);
	}
});
