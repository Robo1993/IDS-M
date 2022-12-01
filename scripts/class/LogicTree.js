//Class LogicTree
//@params: url for tree csv, url for items csv
function LogicTree(tree, items, ut) {
	this.tree = tree;
	this.ut = ut;
	this.items = items;
	this.getRowByRow = getRowByRow;
	this.getRowsByItem = getRowsByItem;
	this.getItemByRow = getItemByRow;
	this.getItemByItem = getItemByItem;
	this.getRowByItemAndScore = getRowByItemAndScore;

	function getRowByRow(x) {
		let treeRow;
		$.each(this.tree.data, function(i, v) {
			if (parseInt(v[0]) == x) {
				treeRow = new Row(parseInt(v[0]), parseInt(v[1]), parseInt(v[2]), parseInt(v[3]), parseInt(v[4]));
			}
		});
		return treeRow;
	}

	function getRowsByItem(item) {
		let rows = [];
		$.each(this.tree.data, function(i, v) {
			if (parseInt(v[1]) == item) {
				let treeRow = new Row(parseInt(v[0]), parseInt(v[1]), parseInt(v[2]), parseInt(v[3]), parseInt(v[4]));
				rows.append(treeRow);
			}
		});
		return rows;
	}

	function getItemByRow(z) {
		let row = this.getRowByRow(z);
		let item = this.getItemByItem(row.item);
		return item;
	}

	function getItemByItem(y) {
		let item;
		let tree = this;
		$.each(this.items.data, function(i, v) {
			if (parseInt(v[0]) == y) {
				if(tree.ut == "ME") {
					item = new MEItem(parseInt(v[0]), parseInt(v[1]), trim(v[2]), trim(v[3]), trim(v[4]), trim(v[5]), trim(v[6]), trim(v[7]));
				}else if(tree.ut == "FN") {
					item = new FNItem(parseInt(v[0]), parseInt(v[1]), trim(v[2]), parseInt(v[3]), parseInt(v[4]), parseInt(v[5]), parseInt(v[6]), parseInt(v[7]), parseInt(v[8]), parseInt(v[9]));
				}else if(tree.ut.indexOf("EZLE") != -1) {
					item = new EZLEItem(parseInt(v[0]), parseInt(v[1]), trim(v[2]), trim(v[3]));
				}else if(tree.ut.indexOf("FA") != -1) {
					item = new FAItem(parseInt(v[0]), parseInt(v[1]), trim(v[2]), trim(v[3]), trim(v[4]), trim(v[5]));
				}else if(tree.ut.indexOf("FS") != -1) {
					item = new FSItem(parseInt(v[0]), parseInt(v[1]), trim(v[2]), trim(v[3]), trim(v[4]));
				}else if(tree.ut == "FW") {
					item = new FWItem(parseInt(v[0]), parseInt(v[1]), trim(v[2]), trim(v[3]));
				}
			}
		});
		return item;
	}

	function getRowByItemAndScore(item, score) {
		return false;
	}
}

//Class Row
//@params: csv file from logic_tree folder in IDS-M Theme
function Row(row, item, score, next_row, abort) {
	this.row = row;
	this.item = item;
	this.score = score;
	this.next_row = next_row;
	this.abort = abort;
}

// //Class Row
// //@params: csv file from logic_tree folder in IDS-M Theme
// function Row(row, item, row_when_correct, row_when_incorrect, abort_when_correct, abort_when_incorrect) {
// 	this.row = row;
// 	this.item = item;
// 	this.row_when_correct = row_when_correct;
// 	this.row_when_incorrect = row_when_incorrect;
// 	this.abort_when_correct = abort_when_correct;
// 	this.abort_when_incorrect = abort_when_incorrect;
// }

//Class MEItem
//@params: csv file from items folder in IDS-M Theme
function MEItem(item, time_barrier, matrix, img1, img2, img3, img4, img5) {
	this.item = item;
	this.time_barrier = time_barrier;
	this.matrix = matrix;
	this.img1 = img1;
	this.img2 = img2;
	this.img3 = img3;
	this.img4 = img4;
	this.img5 = img5;
}

//Class FNItem
//@params: csv file from items folder in IDS-M Theme
function FNItem(item, time_barrier, target, triangle_yellow, triangle_yellow_mirrored, box_yellow, triangle_green, quarter_green, triangle_red, box_red) {
	this.item = item;
	this.time_barrier = time_barrier;
	this.target = target;
	this.triangle_yellow = triangle_yellow;
	this.triangle_yellow_mirrored = triangle_yellow_mirrored;
	this.box_yellow = box_yellow;
	this.triangle_green = triangle_green;
	this.quarter_green = quarter_green;
	this.triangle_red = triangle_red;
	this.box_red = box_red;
}

//Class FWItem
//@params: csv file from items folder in IDS-M Theme
function FWItem(item, time_barrier, targets, options) {
	this.item = item;
	this.time_barrier = time_barrier;
	this.targets = targets;
	this.options = options;
}

//Class VMItem
//@params: csv file from items folder in IDS-M Theme
function EZLEItem(item, time_barrier, maze, eval_template) {
	this.item = item;
	this.time_barrier = time_barrier;
	this.maze = maze;
	this.eval_template = eval_template;
}

//Class VMItem
//@params: csv file from items folder in IDS-M Theme
function FAItem(item, time_barrier, target, overlay, template, eval_template) {
	this.item = item;
	this.time_barrier = time_barrier;
	this.target = target;
	this.overlay = overlay;
	this.template = template;
	this.eval_template = eval_template;
}

//Class VMItem
//@params: csv file from items folder in IDS-M Theme
function FSItem(item, time_barrier, target, template, eval_template) {
	this.item = item;
	this.time_barrier = time_barrier;
	this.target = target;
	this.template = template;
	this.eval_template = eval_template;}