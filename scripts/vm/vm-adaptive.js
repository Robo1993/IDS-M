let vm_subtest;

function initVMA() {
	if(questionCode.indexOf("EZLEA") != -1) {
		vm_subtest = "EZLE"
		url_tree = serverPath + "/upload/themes/survey/IDS-M/files/getTree/ezle-tree.csv";
		url_items = serverPath + "/upload/themes/survey/IDS-M/files/items/ezle-items.csv";
	}else if(questionCode.indexOf("FSA") != -1) {
		vm_subtest = "FS"
		url_tree = serverPath + "/upload/themes/survey/IDS-M/files/getTree/fs-tree.csv";
		url_items = serverPath + "/upload/themes/survey/IDS-M/files/items/fs-items.csv";
	}else if(questionCode.indexOf("FAA") != -1) {
		vm_subtest = "FA"
		url_tree = serverPath + "/upload/themes/survey/IDS-M/files/getTree/fa-tree.csv";
		url_items = serverPath + "/upload/themes/survey/IDS-M/files/items/fa-items.csv";
	}
	current_row = parseInt($("#current-row").text());
	if(!current_row) {
		current_row = 1;
	}
	loadLogicTree();

	function loadLogicTree() {
		readItemsCSV(url_items);
	}

	function createTree() {
		logic_tree = new LogicTree(tree, items, vm_subtest);
		loadAssetsVMA();
	}

	function readLogicTreeCSV(csv) {
		$.get(csv, function( data ) {
			//this.tree = Papa.parse(data);
			tree = Papa.parse(data);
			createTree();
		});
	}

	function readItemsCSV(csv) {
		$.get(csv, function( data ) {
			//this.items = Papa.parse(data);
			items = Papa.parse(data);
			readLogicTreeCSV(url_tree);
		});
	}

	if(questionCode.indexOf("H") != -1) {
		$("#item-area").css("transform", "rotate(180deg)");
		unLock();
		$("#proceed-button").css("display", "block");
	}else if(questionCode.indexOf("Eval") != -1) {
		unLock();
		$("#eval-container").append("<img class='evalImg_drawing' src='"+localStorage.getItem("idsm/" + questionCode)+"' />");
		$("#proceed-button").css("display", "block");
	}else {
		$("#play-button").css("display", "block");
		if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
			$("#speed").css("display", "block");
		}
	}

	//if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		//$("#speed").css("display", "block");
	//}

	$(".evaluation-field").on("click", function() {
		var b_id = $(this).attr("id").substring(1);
		if($("#b" + b_id).css("background-color") == "rgba(0, 0, 0, 0)") {
			$("#b" + b_id).css("background-color", "#99d2a7");
		}else {
			$("#b" + b_id).css("background-color", "rgba(0, 0, 0, 0)");
		}
		var correct = $(".evaluation-field-b[style*='background-color: rgb(153, 210, 167)']").length;
		$("#points_span").text(correct);
		$("#answer"+ questionID + "points").attr("value", correct);
	});

	$("#page-load-screen").css("display", "none");
}

function startVMA() {
	//start = new Date();
	init();
	start = performance.now();
	activateSpeed();
	$("#tp-response-button").css("display", "block");
	//$("#time-bar-fluid").addClass("bar-load-10s-once");
}

function loadAssetsVMA() {
	let item = logic_tree.getItemByRow(current_row);
	let img_src = $(".ezle-img").attr("src");
	let src = img_src.split("/");
	src.splice(src.length - 2, 2);
	let srcS = src.join("/");
	if(questionCode.indexOf("EZLEA") != -1) {
		$("#ezle-img").attr("src", srcS + "/ezlea" + item.item + "/" + item.maze);
		$("#eval-img").attr("src", srcS + "/ezlea" + item.item + "/" + item.eval_template);
	}else if(questionCode.indexOf("FS") != -1){
		$("#fs-target").attr("src", srcS + "/fsa" + item.item + "/" + item.target);
		$("#fs-schablone").attr("src", srcS + "/fsa" + item.item + "/" + item.template);
		$("#eval-img").attr("src", srcS + "/fsa" + item.item + "/" + item.eval_template);
	}else if(questionCode.indexOf("FA") != -1) {
		$("#fa-target").attr("src", srcS + "/faa" + item.item + "/" + item.target);
		$("#fa-overlay").attr("src", srcS + "/faa" + item.item + "/" + item.overlay);
		$("#fa-schablone").attr("src", srcS + "/faa" + item.item + "/" + item.template);
		$("#eval-img").attr("src", srcS + "/faa" + item.item + "/" + item.eval_template);
	}
	
	// Images loaded is zero because we're going to process a new set of images.
	var imagesLoaded = 0;
	// Total images is still the total number of <img> elements on the page.
	var totalImages = $(".question-text img").length;

	// Step through each image in the DOM, clone it, attach an onload event
	// listener, then set its source to the source of the original image. When
	// that new image has loaded, fire the imageLoaded() callback.
	$("img").each(function (idx, img) {
		$("<img>").on("load", imageLoaded).attr("src", $(img).attr("src"));
	});

	// Do exactly as we had before -- increment the loaded count and if all are
	// loaded, call the allImagesLoaded() function.
	function imageLoaded() {
		imagesLoaded++;
		if (imagesLoaded == totalImages) {
			allImagesLoaded();
		}
	}

	function allImagesLoaded() {
		setTimeout(function() {
			$("#page-load-screen").css("display", "none");
			one_click = false;
		}, 500);
	}
}

function feedbackVMA() {
	$("#clock").css("display", "none");
	$("#speed").css("display", "none");
	if(questionCode.indexOf("FS") != -1 || questionCode.indexOf("FA") != -1) {
		$("#schablone").css("display", "block");
		//feedback();
		$("#feedback-button-correct").removeClass("feedback-button");
		$("#feedback-button-false").removeClass("feedback-button");

		$("#feedback-button-correct").on("click", function() {
			answered_correctly = true;
			manualFeedback();
		});

		$("#feedback-button-false").on("click", function() {
			answered_correctly = false;
			manualFeedback();
		});

	}else if(questionCode.indexOf("EZLE") != -1) {
		feedback();
		$("#proceed-button").css("display", "block");
	}
}

function manualFeedback() {
	$("#feedback-button-correct").addClass("feedback-button");
	$("#feedback-button-false").addClass("feedback-button");
	feedback();
	$("#proceed-button").css("display", "block");
}

function evaluateVMA() {
	time_drawing = (end - start) - (end - date_of_last_pickup);

	//$("#time-bar-fluid").removeClass("bar-load-10s-once");

	if(questionCode.indexOf("EZLE") != -1) {
		evaluateEZLEA();
	}else if (questionCode.indexOf("FS") != -1) {
		evaluateFSA();
	}else if(questionCode.indexOf("FA") != -1) {
		evaluateFAA();
	}
	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		//$("#feedback-button").css("display", "block");
		if(questionCode.indexOf("EZLE") == -1) {
			$("#eval-container").css("display", "block");
		}
		feedbackVM();
	}else {
		$("#ls-button-submit").click();
	}
}

function evaluateEZLEA() {
	checkPercentage();
	var time = end - start;
	let item = logic_tree.getItemByRow(current_row);
	let rows = logic_tree.getRowsByItem(item.item);
	let row;
	for (var i = rows.length - 1; i >= 0; i--) {
		r = rows[i];
		if (crossing == 0 && r.score == 0) {
			row = r;
		}else if(crossing > 0 && r.score == 1) {
			row = r;
		}
	}
	localStorage.setItem("idsm/" + questionCode + "Eval", canvas.toDataURL("image/png"));
	$("#answer"+ questionID + "Time").attr("value", time_drawing);
	$("#answer"+ questionID + "Crossed").attr("value", crossing);
	$("#answer"+ questionID + "Percent").attr("value", 100 - percentage +"%");
	$("#answer"+ questionID + "Target").attr("value", target);
	$("#answer"+ questionID + "Pickups").attr("value", pickups);
	$("#answer"+ questionID + "UserDrawing").attr("value", localStorage.getItem("idsm/" + questionCode + "Eval"));
	$("#answer"+ questionID + "NextRow").attr("value", row.next_row);
	$("#answer"+ questionID + "Abort").attr("value", row.abort);
	if(100 - percentage == 0 && target) {
		answered_correctly = true;
	}
}

function evaluateFSA() {
	checkPercentage();
	checkFields();
	localStorage.setItem("idsm/" + questionCode + "Eval", canvas.toDataURL("image/png"));
	var time = end - start;
	let item = logic_tree.getItemByRow(current_row);
	let rows = logic_tree.getRowsByItem(item.item);
	let row;
	for (var i = rows.length - 1; i >= 0; i--) {
		r = rows[i];
		if (crossed_fields == r.score) {
			row = r;
		}
	}
	$("#answer"+ questionID + "Time").attr("value", time_drawing);
	$("#answer"+ questionID + "Percent").attr("value", 100 - percentage +"%");
	$("#answer"+ questionID + "FieldsCrossed").attr("value", crossed_fields);
	$("#answer"+ questionID + "FieldsMissed").attr("value", missed_fields);
	$("#answer"+ questionID + "Pickups").attr("value", pickups);
	$("#answer"+ questionID + "NextRow").attr("value", row.next_row);
	$("#answer"+ questionID + "Abort").attr("value", row.abort);
	$("#answer"+ questionID + "UserDrawing").attr("value", localStorage.getItem("idsm/" + questionCode + "Eval"));
	if(100 - percentage == 0 && missed_fields == 0) {
		answered_correctly = true;
	}
}

function evaluateFAA() {
	checkPercentage();
	checkFields();
	localStorage.setItem("idsm/" + questionCode + "Eval", canvas.toDataURL("image/png"));
	var time = end - start;
	let item = logic_tree.getItemByRow(current_row);
	let rows = logic_tree.getRowsByItem(item.item);
	let row;
	for (var i = rows.length - 1; i >= 0; i--) {
		r = rows[i];
		if (crossed_fields == r.score) {
			row = r;
		}
	}
	$("#answer"+ questionID + "Time").attr("value", time_drawing);
	$("#answer"+ questionID + "Percent").attr("value", 100 - percentage +"%");
	$("#answer"+ questionID + "FieldsCrossed").attr("value", crossed_fields);
	$("#answer"+ questionID + "FieldsMissed").attr("value", missed_fields);
	$("#answer"+ questionID + "Pickups").attr("value", pickups);
	$("#answer"+ questionID + "NextRow").attr("value", row.next_row);
	$("#answer"+ questionID + "Abort").attr("value", row.abort);
	$("#answer"+ questionID + "UserDrawing").attr("value", localStorage.getItem("idsm/" + questionCode + "Eval"));
	if(100 - percentage == 0 && missed_fields == 0) {
		answered_correctly = true;
	}
}