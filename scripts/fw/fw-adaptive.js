var fw_transition_time;
let targets;
let options; 

function initFWA() {
	$("#clock").css("display", "block");
	url_tree = serverPath + "/upload/themes/survey/IDS-M/files/getTree/fw-tree.csv";
	url_items = serverPath + "/upload/themes/survey/IDS-M/files/items/fw-items.csv";
	current_row = parseInt($("#current-row").text());
	if(!current_row) {
		current_row = 1;
	}
	loadLogicTree();

	function loadLogicTree() {
		readItemsCSV(url_items);
	}

	function createTree() {
		logic_tree = new LogicTree(tree, items, "FW");
		fw_transition_time = estimateTimeA();
		loadImagesFWA();
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
}

function startFWA() {

	$(".img-box").on("click", function(){
		if(!locked) {
			if($(this).css("background-color") == "rgba(0, 0, 0, 0)" || $(this).css("background-color") == "rgb(255, 255, 255)") {
				$(this).css("background-color", "rgb(204, 204, 204)");
			}else if($(this).css("background-color") == "rgb(204, 204, 204)") {
				$(this).css("background-color", "rgba(0, 0, 0, 0)");
			}

			var selections = $(".img-box").filter(function(){
				return $(this).css('background-color') === "rgb(204, 204, 204)";
			}).length;
			if(selections == 0) {
				option_selected = false;
			}else {
				option_selected = true;
			}
		}
	});
	
	unLock();
	$("#fw-target").css("display", "block");
	activateClock();
	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$("#next-button").css("display", "block");
	}else {
		setTimeout(function() {
			$("#clock").css("display", "none");
			$("#tp-response-button").css("display", "block");
			$("#fw-targets").css("display", "none");
			$("#fw-options").css("display", "flex");
			start = performance.now();
		}, fw_transition_time);
	}
}

String.prototype.symbol=function(extension) {
	var s= this.replace(/\\/g, '/');
	s= s.substring(s.lastIndexOf('/')+ 1);
	let filename = extension? s.replace(/[?#].+$/, ''): s.split('.')[0];
	return filename.split("-")[0];
}

function feedbackFWA() {
	var anythingWrong = false;
	$("#clock").css("display", "none");

	$(".fwFigures").each(function() {
		let symbol = $(this).attr("src").symbol();
		let match = false;
		let e = $(this);
		e.parent().toggleClass("td_transition");
		targets.forEach(function(t) {
			if(symbol == t) {
				if(e.parent().css("background-color") == "rgb(204, 204, 204)") {
					e.parent().css({"background-color":"#cfc"}, 1000);
					match = true;
				}else {
					e.parent().addClass("feedback-blink");
					anythingWrong = true;
				}
			}
		});
		if(!match && e.parent().css("background-color") == "rgb(204, 204, 204)") {
			e.parent().css({"background-color":"#fcc"}, 1000);
			anythingWrong = true;
		}
	});
}

function nextFWA() {
	$("#tp-response-button").css("display", "block");
	$("#clock").css("display", "none");
	$("#fw-target").css("display", "none");
	$("#fw-answer-block").css("display", "flex");
}

function estimateTimeA() {
	let item = logic_tree.getItemByRow(current_row);
	$(":root").css("--duration", item.time_barrier +"ms");
	return item.time_barrier;
}

function loadImagesFWA() {
	let item = logic_tree.getItemByRow(current_row);
	targets = item.targets.split("; ");
	options = item.options.split("; ");
	let template_img_src = $(".fwFigures").first().attr("src");
	let src = template_img_src.split("/");
	src.splice(src.length - 1, 1);
	let srcS = src.join("/");

	$(".fwFigures").remove();

	targets.forEach(function(t) {
	    $("#fw-targets").append("<img class='fwFigures fwTargets' src='" + srcS + "/" + t + "' />");
	});

	options.forEach(function(o) {
	    $("#fw-options").append("<div class='img-box'><img class='fwFigures' src='" + srcS + "/" + o + "' /></div>");
	});

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
			startFWA();
			one_click = false;
		}, 500);
	}
}

function evaluateFWA() {
	var time = end - start;

	var correct_figures = 0;
	var wrong_figures = 0;
	var false_left_out = 0;

	var selected_figures = $(".fwFigures").filter(function(){
		var color = $(this).parent().css("background-color");
		return color === "rgb(204, 204, 204)";
	});

	selected_figures.each(function() {
		let symbol = $(this).attr("src").symbol();
		let match = false;
		targets.forEach(function(t) {
			let target = t.split("-")[0];
			if(symbol == target) {
				correct_figures++;
				match = true;
			}
		});
		if(!match) {
			wrong_figures++;
		}
	});

	false_left_out = targets.length - correct_figures;

	let item = logic_tree.getItemByRow(current_row);
	let rows = logic_tree.getRowsByitem(item.item);
	let row;
	for (var i = rows.length - 1; i >= 0; i--) {
		r = rows[i];
		if ((correct_figures - wrong_figures) == r.score) {
			row = r;
		}
	}

	$("#answer"+ questionID +"Time").attr("value", time);
	$("#answer"+ questionID +"Missed").attr("value", false_left_out);
	$("#answer"+ questionID +"Correct").attr("value", correct_figures);
	$("#answer"+ questionID +"Wrong").attr("value", wrong_figures);

	let row = logic_tree.getRowByRow(current_row);
	//at the moment we use the logic tree as follows: when total points are > 0, we will jump to the next row that is in row_when_correct. We need to define a better solution for this.
	//Maybe we could define a threshhold for what counts as correct and put it in fw-tree.csv
	if((correct_figures - wrong_figures) < 0) {
		$("#answer"+ questionID +"Total").attr("value", 0);
	}else {
		$("#answer"+ questionID +"Total").attr("value", correct_figures - wrong_figures);
	}

	$("#answer"+ questionID +"NextRow").attr("value", row.next_row);
	$("#answer"+ questionID +"Abort").attr("value", row.abort);

	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$("#feedback-button").css("display", "block");
	}else {
		$("#proceed-button").click();
	}
}

function getQuestionNr() {
	if(getQuestionType() == "D") {
		if(questionCode.indexOf("UB") != -1) {
			return parseInt(questionCode.substring(6));
		}else if(questionCode.indexOf("T") != -1) {
			return parseInt(questionCode.substring(4));
		}
	}else if(getQuestionType() == "I") {
		if(questionCode.indexOf("UB") != -1) {
			return parseInt(questionCode.substring(6));
		}else if(questionCode.indexOf("TFZT") != -1) {
			return parseInt(questionCode.substring(4));
		}
	}else {
		if(questionCode.indexOf("UB") != -1) {
			return parseInt(questionCode.substring(5));
		}else if(questionCode.indexOf("T") != -1) {
			return parseInt(questionCode.substring(3));
		}
	}
}