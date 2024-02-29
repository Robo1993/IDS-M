function initRM() {

	startRM();

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

function startRM() {
	unLock();
	start = performance.now();
	$("#tp-response-button").css("display", "block");
}

function feedbackRM() {
	if(!answered_correctly) {
		$(".me-thumbnail").filter(function() {
			return $(this).attr("src").indexOf("correct") != -1;
		}).addClass("feedback-blink");
	}
	feedback();
}

function evaluateRM() {
	locked = true;
	$("#tp-response-button").css("display", "none");
	$("#clock").css("display", "none");
	var src = $(".me-thumbnail").filter(function() {
		return $(this).css("background-color") == "rgb(204, 204, 204)";
	}).attr("src");
	var file = getAnswerRM(src);
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
		$("#feedback-button").click();
	}else {
		$("#proceed-button").click();
	}
}

function getAnswerRM(src) {
	if(src) {
		var name = src.replace( /^.*?([^\/]+)\..+?$/, '$1' );
		return name;
	}else {
		return "none";
	}
}

