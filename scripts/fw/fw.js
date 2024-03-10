var fw_transition_time;
var target_figures = [];

function initFW() {
	//if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$("#clock").css("display", "block");
	//}
	calcTargets();
	fw_transition_time = estimateTime();
	startFW();

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
}

function startFW() {
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

function calcTargets() {
	$(".fwFigures").each(function(){
		target_figures.push($(this).attr("src").symbol());
	});
}

String.prototype.symbol=function(extension) {
	var s= this.replace(/\\/g, '/');
	s= s.substring(s.lastIndexOf('/')+ 1);
	let filename = extension? s.replace(/[?#].+$/, ''): s.split('.')[0];
	return filename.split("-")[0];
}

function feedbackFW() {
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

function nextFW() {
	$("#tp-response-button").css("display", "block");
	$("#clock").css("display", "none");
	$("#fw-target").css("display", "none");
	$("#fw-answer-block").css("display", "flex");
}

function estimateTime() {
	let time = 0;
	let targets = target_figures.length;
	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$(":root").css("--duration", "15s");
	}else {
		if(targets <= 2) {
			time = 5000;
			$(":root").css("--duration", "5s");
		}else if(targets == 3) {
			time = 10000;
			$(":root").css("--duration", "10s");
		}else if(targets >= 4) {
			time = 15000;
			$(":root").css("--duration", "15s");
		}
	}
	
	return time;
}

function evaluateFW() {
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

	if((correct_figures - wrong_figures - false_left_out) < 0) {
		$("#answer"+ questionID +"Answer").attr("value", 0);
	}else {
		$("#answer"+ questionID +"Answer").attr("value", correct_figures - wrong_figures - false_left_out);
	}

	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$("#feedback-button").css("display", "block");
		$("#feedback-button").click();
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