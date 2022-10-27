var fw_transition_time;
var target_figures;
var current_row;
let url_tree;
let url_items;
let tree;
let items;

function initFWA() {
	//if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$("#clock").css("display", "block");
	//}
	url_tree = serverPath + "/upload/themes/survey/IDS-M/files/getTree/fw-tree.csv";
	url_items = serverPath + "/upload/themes/survey/IDS-M/files/items/fw-items.csv";
	current_row = parseInt($("#current-row").text());
	if(!current_row) {
		current_row = 1;
	}
	loadLogicTree();

	$(".img-box").click(function(){
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

	function loadLogicTree() {
		readItemsCSV(url_items);
	}

	function createTree() {
		logic_tree = new LogicTree(tree, items, "FW");
		fw_transition_time = estimateTimeA();
		//loadImagesFWA();
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
	unLock();
	$("#fw-target").css("display", "block");
	start = performance.now();
	activateClock();
	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$("#next-button").css("display", "block");
	}else {
		setTimeout(function() {
			$("#clock").css("display", "none");
			$("#tp-response-button").css("display", "block");
			$("#fw-target").css("display", "none");
			$("#fw-answer-block").css("display", "flex");
		}, fw_transition_time);
	}
}

// String.prototype.symbol=function(extension) {
// 	var s= this.replace(/\\/g, '/');
// 	s= s.substring(s.lastIndexOf('/')+ 1);
// 	let filename = extension? s.replace(/[?#].+$/, ''): s.split('.')[0];
// 	return filename.split("-")[0];
// }

function feedbackFWA() {
	var anythingWrong = false;
	$("#clock").css("display", "none");

	$(".figuren_img").each(function() {
		let symbol = $(this).attr("src").symbol();
		let match = false;
		let e = $(this);
		e.parent().toggleClass("td_transition");
		target_figures.forEach(function(t) {
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
	$(":root").css("--duration", item.time +"ms");
	return item.time;
}

function loadImagesFWA() {
	let img_counter = 0;
	let item = logic_tree.getItemByRow(current_row);

	// let src = $(".me-matrix").attr("src").split("/");
	// src.splice(src.length - 2, 2);
	// let srcS = src.join("/");

	//$(".me-matrix").attr("src", srcS + "/me" + item.item + "/" + item.matrix);
	$(".fwFigures").each(function() {
		$(this).attr("src", srcS + "/me" + item.item + "/" + imgs[img_counter]);
		if(!imgs[img_counter]) {
			$(this).remove();
		}
		img_counter++;
	});
	item_counter++;

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

	var selected_figures = $(".figuren_img").filter(function(){
		var color = $(this).parent().css("background-color");
		return color === "rgb(204, 204, 204)";
	});

	selected_figures.each(function() {
		let symbol = $(this).attr("src").symbol();
		let match = false;
		target_figures.forEach(function(t) {
			if(symbol == t) {
				correct_figures++;
				match = true;
			}
		});
		if(!match) {
			wrong_figures++;
		}
	});

	false_left_out = target_figures.length - correct_figures;

	$("#answer"+ questionID +"Time").attr("value", time);
	$("#answer"+ questionID +"Missed").attr("value", false_left_out);
	$("#answer"+ questionID +"Correct").attr("value", correct_figures);
	$("#answer"+ questionID +"Wrong").attr("value", wrong_figures);

	if((correct_figures - wrong_figures) < 0) {
		$("#answer"+ questionID +"Total").attr("value", 0);
	}else {
		$("#answer"+ questionID +"Total").attr("value", correct_figures - wrong_figures);
	}

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