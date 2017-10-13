// on open, display all current items available to buy
// then prompt user for one of two things: 
	// ask for the ID of the product they want to buy
	// ask how many units of the product they want to buy
// once the order is placed, the app checks to see if there is enough quantity to satisfy the purchase 
	// if not, display a phrase like "Insuff quant!" and prevent the order 
	// if there is enough, fulfill the order 
		// this means update the SQL database to reflect remaining quantity
		// once the update goes thru, show customer the total cost of purchase 


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
			invList.push(res[i].product_name);
		}

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
							
							var totalCost = (parseInt(selectedItem.price)*parseInt(quantity.quantity));
							
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

										console.log("Congrats!\n"+
											"You just purchased "+quantity.quantity+
											" of the "+selectedItem.product_name+
											" for a total cost of $"+totalCost+".");

										displayInventory();
									}
									else {
										console.log("That's alright, let's start from the beginning.");
										displayInventory();
									}
								});

						}
						else {
							console.log("Hold on tiger, there's not enough for that big of an order!"+
								"  Let's start from the beginning.");
							displayInventory();
						}
					});
			});
	});
	// connection.end();
}








