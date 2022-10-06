//Class LogicTree
//@params: csv file from file folder in IDS-M Theme
function LogicTree(tree, items) {
	this.tree = tree;
	this.items = items;
	this.getRowByRow = getRowByRow;
	this.getRowByItem = getRowByItem;
	this.getItemByRow = getItemByRow;
	this.getItemByItem = getItemByItem;

	function getRowByRow(x) {
		let treeRow;
		$.each(this.tree.data, function(i, v) {
			if (parseInt(v[0]) == x) {
				treeRow = {
					row: parseInt(v[0]),
					item: parseInt(v[1]),
					row_when_correct: parseInt(v[2]),
					row_when_incorrect: parseInt(v[3]),
					abort_when_correct: trim(v[4]) === "true",
					abort_when_incorrect: trim(v[5]) === "false"
				}
			}
		});
		return treeRow;
	}

	function getRowByItem(item) {
		let treeRow;
		$.each(this.tree.data, function(i, v) {
			if (parseInt(v[1]) == item) {
				treeRow = new Row(parseInt(v[0]), parseInt(v[1]), parseInt(v[2]), parseInt(v[3]), trim(v[4]) === "true", trim(v[5]) === "false");
			}
		});
		return treeRow;
	}

	function getItemByRow(z) {
		let row = this.getRowByRow(z);
		let item = this.getItemByItem(row.item);
		return item;
	}

	function getItemByItem(y) {
		let item;
		$.each(this.items.data, function(i, v) {
			if (parseInt(v[0]) == y) {
				item = new Item(parseInt(v[0]), trim(v[1]), trim(v[2]), trim(v[3]), trim(v[4]), trim(v[5]), trim(v[6]));
			}
		});
		return item;
	}
}

//Class Row
//@params: csv file from logic_tree folder in IDS-M Theme
function Row(row, item, row_when_correct, row_when_incorrect, abort_when_correct, abort_when_incorrect) {
	this.row = row;
	this.item = item;
	this.row_when_correct = row_when_correct;
	this.row_when_incorrect = row_when_incorrect;
	this.abort_when_correct = abort_when_correct;
	this.abort_when_incorrect = abort_when_incorrect;
}

//Class Item
//@params: csv file from items folder in IDS-M Theme
function Item(item, matrix, img1, img2, img3, img4, img5) {
	this.item = item;
	this.matrix = matrix;
	this.img1 = img1;
	this.img2 = img2;
	this.img3 = img3;
	this.img4 = img4;
	this.img5 = img5;
}