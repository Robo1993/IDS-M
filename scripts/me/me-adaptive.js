let logic_tree;

function initME() {

	$("#clock").css("display", "block");
	logic_tree = new LogicTree("me.csv");
	fillInImg();
	startME();

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

}

function startME() {
	unLock();
	start = performance.now();
	$("#tp-response-button").css("display", "block");
	timeLimits();
	activateClock();
}

function timeLimits() {
	$(":root").css("--duration", "180s");
	if(questionCode.indexOf("T") != -1) {
		if(questionCode.indexOf("1T") != -1) {
			$(":root").css("--duration", "30s");
			setTimeout(function() {
				if(!locked) {
					end = performance.now();
					evaluateME();
				}
			}, 30000);
		}else if(questionCode.indexOf("2T") != -1) {
			$(":root").css("--duration", "45s");
			setTimeout(function() {
				if(!locked) {
					end = performance.now();
					evaluateME();
				}
			}, 45000);
		}else if(questionCode.indexOf("3T") != -1) {
			$(":root").css("--duration", "60s");
			setTimeout(function() {
				if(!locked) {
					end = performance.now();
					evaluateME();
				}
			}, 60000);
		}
	}else if(questionCode.indexOf("R") != -1) {
		let question_number = parseInt(questionCode.slice(questionCode.length - 2));
		if(question_number < 11) {
			$(":root").css("--duration", "60s");
			setTimeout(function() {
				if(!locked) {
					end = performance.now();
					evaluateME();
				}
			}, 60000);
		}else if(question_number > 10 && question_number < 21) {
			$(":root").css("--duration", "90s");
			setTimeout(function() {
				if(!locked) {
					end = performance.now();
					evaluateME();
				}
			}, 90000);
		}else if(question_number > 20) {
			$(":root").css("--duration", "120s");
			setTimeout(function() {
				if(!locked) {
					end = performance.now();
					evaluateME();
				}
			}, 120000);
		}
	}
}

function feedbackME() {
	if(!answered_correctly) {
		$(".me-thumbnail").filter(function() {
			return $(this).attr("src").indexOf("correct") != -1;
		}).addClass("feedback-blink");
	}
	feedback();
}

function fillInImg() {
	let img_counter = 1;
	$(".question-text img").each(function() {
		let src = $(this).attr("src").split("/");
		src.splice(src.length - 3, 3);
		let srcS = src.join("/");
		$(this).attr("src", srcS + "/set" + set + "/item" + (item_counter + 1) + "/" + img_counter + ".png");
		img_counter++;
	});
	item_counter++;

	// Images loaded is zero because we're going to process a new set of images.
	var imagesLoaded = 0;
	// Total images is still the total number of <img> elements on the page.
	var totalImages = $(".ppvt-img").length;

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
			$("#play-button").css("display", "block");
			one_click = false;
		}, 500);
	}
}

function evaluateME() {
	locked = true;
	$("#tp-response-button").css("display", "none");
	$("#clock").css("display", "none");
	var src = $(".me-thumbnail").filter(function() {
		return $(this).css("background-color") == "rgb(204, 204, 204)";
	}).attr("src");
	var file = getAnswer(src);
	var time = end - start;
	if(file == "correct") {
		$("#answer"+ questionID +"Answer").attr("value", 1);
		answered_correctly = true;
	}else {
		$("#answer"+ questionID +"Answer").attr("value", 0);
		answered_correctly = false;
	}
	$("#answer"+ questionID +"Item").attr("value", file);
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
	if() {

	}else if () {

	}else if () {
		
	}
}

function getFile(url) {
	$.get(url, function( data ) {
		
	});
}

