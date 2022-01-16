//Gets data from Local Storage
let data = getFromLS();

//Dom Elements
const inStockBtns = document.querySelectorAll('.in-stock-btn');
const vMOne = document.querySelector('.vmOne');
const vMTwo = document.querySelector('.vmTwo');
const restockBtn = document.querySelector('.restock-btn');
const restockMsg = document.querySelector('.restock-msg');

const drinkInput = document.querySelector('#drink');
const amountInput = document.querySelector('#amount');
const submitBtn = document.querySelector('#submit');

const drinkOptions = document.querySelector('#drink');

const responseDOM = document.querySelector('.response');
const drinksSoldDOM = document.querySelector('.drinksSold');

//fsq3R5SEfatvSD2saz42igssHhbnnz7otzdI6/4A6Hyl2YA=
//Event Listeners
document.addEventListener('DOMContentLoaded', () => {
	loadList();
	loadDrinkOptions();
});

inStockBtns.forEach(btns => {
	//Add event listener to cancel btn
	btns.nextElementSibling.querySelector('.cancel').addEventListener('click', e => {
		e.target.parentElement.classList.remove('active');
	});

	//Toggle the active class in the stock div
	btns.addEventListener('click', e => {
		e.target.parentElement.querySelector('.in-stock').classList.toggle('active');
	});
});

submitBtn.addEventListener('click', e => {
	e.preventDefault();

	if (amountInput.value > 0 && drinkInput.value) {
		getAndUpdateItem(drinkInput.value, amountInput.value);
	}
});

restockBtn.addEventListener('click', restockVMachines);

//PASS
//Replace data with default data
function restockVMachines() {
	localStorage.removeItem('data');
	data = getFromLS();
	loadList();

	restockMsg.textContent = 'Vending Machines have been restocked';
	setTimeout(() => {
		restockMsg.textContent = '';
	}, 2000);
}

//PASS
//Load List of Items in Dom
function loadList() {
	//Creates HTML template of all items
	let output = '';
	Object.keys(data).map(machine => {
		Object.keys(data[machine]).map(element => {
			const item = data[machine][element];
			output += `
            <div class="drink">
                <div class="name">${item.name}</div>
                <div class="amount">${item.amount}</div>
            </div>
        `;
		});

		if (machine === 'machineOne') {
			vMOne.innerHTML = output;
			output = '';
		} else {
			vMTwo.innerHTML = output;
		}
	});
}

//PASS
//Load drinks as options
function loadDrinkOptions() {
	let allDrinks = [];
	Object.keys(data).map(machine => {
		Object.keys(data[machine]).map(drink => {
			allDrinks.push(data[machine][drink].name);
		});
	});

	let filteredDrinks = allDrinks.filter((drink, index) => {
		return allDrinks.indexOf(drink) === index;
	});

	let output = '';
	filteredDrinks.forEach(drink => {
		output += `<option value="${drink}">${drink}</option>`;
	});

	drinkOptions.innerHTML += output;
}

//Gets and updates data
function getAndUpdateItem(drink, amount) {
	//Checks if theres an drink in stock
	if (isStoreEmpty()) {
		displayResultDOM('No drink available at the moment', 0);
		return;
	}

	//Adds available requested drink amount to an array
	let output = [];
	const original_amount = parseInt(amount);

	Object.keys(data).map(machine => {
		Object.keys(data[machine]).map(element => {
			if (data[machine][element].name === drink) output.push(data[machine][element].amount);
		});
	});

	//Takes total requested from the array
	for (let i = 0; i < output.length; i++) {
		if (amount - output[i] <= 0) {
			output[i] = output[i] - amount;
			amount = 0;
		} else {
			amount = amount - output[i];
			output[i] = 0;
		}
	}

	//Writes the new amount left after taking from data
	for (let i = 0, j = 0; j < Object.keys(data).length; j++) {
		data[Object.keys(data)[j]].map(drinkObj => {
			if (drinkObj.name === drink) {
				drinkObj.amount = output[i];
				i++;
			}
		});
	}

	//Displays the result of the operation
	if (amount === 0) {
		displayResultDOM('Here are your drinks', original_amount);
	} else if (amount === original_amount) {
		displayResultDOM('Not in stock', 0);
	} else {
		original_amount - amount !== 1
			? displayResultDOM(
					"There's only " +
						(original_amount - amount) +
						' of that drink in stock. Here they are',
					original_amount - amount
			  )
			: displayResultDOM("There's only 1 of that drink in stock. Here it is", 1);
	}

	//Saves the new data to Local Storage
	writeToLS(JSON.stringify(data));

	//Update list in DOM
	loadList();

	//Empty amount input
	amountInput.value = '';
}

//Write the updated data to Local Storage
function writeToLS(data) {
	localStorage.setItem('data', data);
}

//PASS
//Gets the data from Local Storage or returns a new data
function getFromLS() {
	const data = localStorage.getItem('data');
	if (data) {
		return JSON.parse(data);
	} else {
		return {
			machineOne: [
				{ name: 'Fanta', amount: 11 },
				{ name: 'Coke', amount: 6 },
				{ name: 'Smoov', amount: 13 },
				{ name: 'Yogurt', amount: 10 },
				{ name: '7Up', amount: 8 },
				{ name: 'Maltina', amount: 12 },
				{ name: 'Chivita', amount: 12 },
			],
			machineTwo: [
				{ name: '7Up', amount: 5 },
				{ name: 'Sprite', amount: 7 },
				{ name: 'Fearless', amount: 11 },
				{ name: 'Henessy', amount: 14 },
				{ name: 'Smoov', amount: 7 },
				{ name: 'Predator', amount: 9 },
				{ name: '5 Alive', amount: 10 },
			],
		};
	}
}

//Checks if theres at least one drink in stock
function isStoreEmpty() {
	let in_store = true;

	Object.keys(data).map(machine => {
		Object.keys(data[machine]).map(drink => {
			if (data[machine][drink].amount > 0) in_store = false;
		});
	});

	return in_store;
}

//Displays response of the getting Item operation in DOM
function displayResultDOM(response, amount_sold) {
	responseDOM.innerText = response;
	drinksSoldDOM.textContent = '';

	const duration = amount_sold * 500;

	const showDrinks = setInterval(() => {
		drinksSoldDOM.innerHTML +=
			'<img src="energy-drink.png" alt="Energy drink" class="eDrink"/>';
	}, 500);

	setTimeout(() => {
		clearInterval(showDrinks);
	}, duration);
}
