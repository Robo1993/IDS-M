function readCSV(csv, lt) {
	let url = serverPath + "/upload/themes/survey/IDS-M/files/getTree/" + csv;
	$.get(url, function( data ) {
		lt.tree = Papa.parse(data)
	});
}

//Class LogicTree$
//@params: csv file from file folder in IDS-M Theme
function LogicTree(csv) {
	this.csv = csv;
	this.readCSV = readCSV;
	this.getRowByRow = getRowByRow;
	this.getRowByItem = getRowByItem;
	readCSV(csv, this);

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
}

//Class Row
//@params: csv file from file folder in IDS-M Theme
function Row(row, item, row_when_correct, row_when_incorrect, abort_when_correct, abort_when_incorrect) {
	this.row = row;
	this.item = item;
	this.row_when_correct = row_when_correct;
	this.row_when_incorrect = row_when_incorrect;
	this.abort_when_correct = abort_when_correct;
	this.abort_when_incorrect = abort_when_incorrect;

}