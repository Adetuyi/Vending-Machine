class UI {
	constructor() {
		//Gets data from Local Storage
		this.data = getFromLS();

		//Dom Elements
		this.vContainer = document.querySelector(".VMContainer");
	}

	//Load List of Items in Dom
	loadList() {
		//Creates HTML template of all items
		let output = "";
		Object.keys(this.data).map(machine => {
			output += "<div class='VMachine'>";
			Object.keys(this.data[machine]).map(element => {
				const item = this.data[machine][element];
				output += `
            <div class="itemContainer">
                <div class="item">${item.name}</div>
                <div class="price">${item.amount_in_stock}</div>
            </div>
        `;
			});
			output += `</div>
        `;
		});
		this.vContainer.innerHTML = output;
	}

	//Gets and updates data
	getAndUpdateItem(item, amount) {
		//Adds available requested item amount to an array
		let output = [];
		const original_amount = amount;
		Object.keys(this.data).map(machine => {
			Object.keys(this.data[machine]).map(element => {
				if (element === item) output.push(this.data[machine][item].amount_in_stock);
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

		//Writes the new amount left after taking back to data
		for (let i = 0, j = 0; i < output.length; i++, j++) {
			if (this.data[Object.keys(this.data)[j]].hasOwnProperty(item) === true) {
				this.data[Object.keys(this.data)[j]][item].amount_in_stock = output[i];
			} else {
				i--;
			}
		}

		//Displays the result of the operation
		if (amount === 0) {
			console.log("we have enough");
		} else if (amount === original_amount) {
			console.log("not in stock");
		} else {
			console.log("We only have " + (original_amount - amount) + " in stock");
		}

		//Saves the new data to Local Storage
		writeToLS(JSON.stringify(this.data));
	}

	//Write the data to Local Storage
	writeToLS(data) {
		localStorage.setItem("data", data);
	}

	//Gets the data from Local Storage or returns a new data
	getFromLS() {
		const data = localStorage.getItem("data");
		if (data) {
			return JSON.parse(data);
		} else {
			const data = {
				vendingMachine1: {
					fanta: { name: "Fanta", amount_in_stock: 5 },
					coke: { name: "Coke", amount_in_stock: 10 },
				},
				vendingMachine2: {
					fanta: { name: "Fanta", amount_in_stock: 6 },
					sprite: { name: "Sprite", amount_in_stock: 4 },
				},
			};
			return data;
		}
	}

	//Checks if theres at least one item in stock
	checkInStock() {}

	//Displays response of the getting Item operation
	displayResultDOM() {}
}

export const ui = new UI();
