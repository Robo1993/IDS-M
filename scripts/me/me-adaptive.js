
var logic_tree;
var items;
var tree;
var url_tree;
var url_items;
var current_row;

function initMEA() {

	$("#clock").css("display", "block");
	url_tree = serverPath + "/upload/themes/survey/IDS-M/files/getTree/me-tree.csv";
	url_items = serverPath + "/upload/themes/survey/IDS-M/files/items/me-items.csv";
	loadLogicTree();

	// Option selection
	$(".me-thumbnail").on("click", function() {
		if(!locked) {
			if($(this).css("background-color") == "rgba(0, 0, 0, 0)") {
				$(".me-thumbnail").each(function() {
					$(this).css("background-color", "");
				});
				$(this).css("background-color", "#ccc");
				option_selected = true;
			}else {
				$(this).css("background-color", "");
				option_selected = false;
			}
		}
	});

	function loadLogicTree() {
		readItemsCSV(url_items);
	}

	function createTree() {
		logic_tree = new LogicTree(tree, items, "ME");
		loadImgs();
	}

	function readLogicTreeCSV(csv) {
		$.get(csv, function( data ) {
			//this.tree = Papa.parse(data);
			tree = Papa.parse(data);
			createTree();
		});
	}

	function readItemsCSV(csv, readCSV) {
		$.get(csv, function( data ) {
			//this.items = Papa.parse(data);
			items = Papa.parse(data);
			readLogicTreeCSV(url_tree);
		});
	}
}

function startMEA() {
	unLock();
	start = performance.now();
	$("#tp-response-button").css("display", "block");
	timeLimitsMEA();
	activateClock();
}

function timeLimitsMEA() {
	let item = logic_tree.getItemByRow(current_row);
	$(":root").css("--duration", item.time +"ms");
	setTimeout(function() {
		if(!locked) {
			end = performance.now();
			evaluateMEA();
		}
	}, item.time);
}

function feedbackMEA() {
	if(!answered_correctly) {
		$(".me-thumbnail").filter(function() {
			return $(this).attr("src").indexOf("correct") != -1;
		}).addClass("feedback-blink");
	}
	feedback();
}

function loadImgs() {
	let img_counter = 0;
	current_row = parseInt($("#me-row").text());
	if(!current_row) {
		current_row = 1;
	}
	let item = logic_tree.getItemByRow(current_row);
	let imgs = [item.img1, item.img2, item.img3, item.img4, item.img5];

	let src = $(".me-matrix").attr("src").split("/");
	src.splice(src.length - 2, 2);
	let srcS = src.join("/");

	$(".me-matrix").attr("src", srcS + "/me" + item.item + "/" + item.matrix);
	$("#thumbnail-container img").each(function() {
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
		$("<img>").on("load", imageLoaded).attr("src", $(img).attr("src"))
	});

	// Do exactly as we had before -- increment the loaded count and if all are
	// loaded, call the allImagesLoaded() function.
	function imageLoaded() {
		imagesLoaded++
		if (imagesLoaded == totalImages) {
			allImagesLoaded();
		}
	}

	function allImagesLoaded() {
		setTimeout(function() {
			$("#page-load-screen").css("display", "none");
			startMEA();
			one_click = false;
		}, 500);
	}
}

function evaluateMEA() {
	locked = true;
	$("#tp-response-button").css("display", "none");
	$("#clock").css("display", "none");
	var src = $(".me-thumbnail").filter(function() {
		return $(this).css("background-color") == "rgb(204, 204, 204)";
	}).attr("src");
	var file = getAnswer(src);
	var time = end - start;
	let row = logic_tree.getRowByRow(current_row);
	if(file.indexOf("correct") != -1) {
		$("#answer"+ questionID +"Answer").attr("value", 1);
		answered_correctly = true;
		$("#answer"+ questionID +"NextRow").attr("value", row.row_when_correct);
		$("#answer"+ questionID +"Abort").attr("value", row.abort_when_correct);
	}else {
		$("#answer"+ questionID +"Answer").attr("value", 0);
		answered_correctly = false;
		$("#answer"+ questionID +"NextRow").attr("value", row.row_when_incorrect);
		$("#answer"+ questionID +"Abort").attr("value", row.abort_when_incorrect);
	}
	$("#answer"+ questionID +"Selection").attr("value", file);
	$("#answer"+ questionID +"Time").attr("value", time);

	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$("#feedback-button").css("display", "block");
	}else {
		$("#proceed-button").click();
	}
}

function getAnswer(src) {
	if(src) {
		var name = src.replace( /^.*?([^\/]+)\..+?$/, '$1' );
		return name;
	}else {
		return "none";
	}
}

function getFileNames(matrix) {
	let file_names = [];
	for (var i = 1; i >= 0; i++) {
		
	}
}

function getFile(url) {
	$.get(url, function( data ) {
		
	});
}

