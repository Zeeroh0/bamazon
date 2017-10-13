var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});


connection.connect(function(err) {
	if (err) throw err;
	displayInventory();
});




function displayInventory() {

	console.log("\n----------------------------\n"+
		"    Welcome to BAMAZON!\n"+
		"----------------------------\n\n");

	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;

		var invList = [];
		for (var i = 0; i < res.length; i++) {
			if (res[i].stock_quantity > 0) {
				invList.push(res[i].product_name);
			}
		}

		if (invList.length === 0) {
			console.log("Sorry!  We're all out of inventory.");
		} else {

		inquirer
			.prompt(
				{
					name: "choice",
					type: "list",
					message: "Please select a product below to purchase:",
					choices: invList
				}
			)
			.then(function(choice) {
				// Get the user's selected item to buy by looping thru
				// all the products and finding the matching object via
				// the product name.
				var selectedItem;
				for (var i = 0; i <res.length; i++) {
					if (choice.choice === res[i].product_name) {
						selectedItem = res[i];
					}
				}

				inquirer
					.prompt(
						{
						name: "quantity",
						type: "input",
						message: "There are "+selectedItem.stock_quantity+
							" of the "+choice.choice+"s still available.\n"+
							"How many would you like to buy?",
						}
					)
					.then(function(quantity) {
						if (parseInt(quantity.quantity) <= selectedItem.stock_quantity) {
							
							var totalCost = (parseFloat(selectedItem.price)*parseFloat(quantity.quantity));
							
							inquirer
								.prompt(
									{
									name: "price",
									type: "confirm",
									message: "The "+selectedItem.product_name+
										" costs "+selectedItem.price+
										" each.  To purchase "+quantity.quantity+
										" of these, your total cost will be $"+totalCost+
										".  Is that alright?",
									default: true
									}
								)
								.then(function(confirm){
									if (confirm.price === true) {

										var newQuantity = selectedItem.stock_quantity -= quantity.quantity;

										connection.query(
											"UPDATE products SET ? WHERE ?",
											[
												{
													stock_quantity: newQuantity
												},
												{
													product_name: choice.choice
												}
											],
											function(error) {
												if (error) {
													throw error; 
												}
											}
										);

										console.log("\n*********************\n"+
											"     Congrats!"+
											"\n*********************\n"+
											"\nYou just purchased "+quantity.quantity+
											" of the "+selectedItem.product_name+
											" for a total cost of $"+totalCost+".");

										displayInventory();
									}
									else {
										console.log("\nThat's alright, let's start from the beginning.");
										displayInventory();
									}
								});

						}
						else {
							console.log("\nHold on tiger, there's not enough for that big of an order!"+
								"  Let's start from the beginning.");
							displayInventory();
						}
					});
			});
		}
	});
	// connection.end();
}








