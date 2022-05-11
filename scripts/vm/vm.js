let time_drawing;

function initVM() {
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
		$("#speed").css("display", "block");
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

function startVM() {
	start = new Date();
	init();
	activateSpeed();
	$("#tp-response-button").css("display", "block");
	//$("#time-bar-fluid").addClass("bar-load-10s-once");
}

function feedbackVM() {
	$("#clock").css("display", "none");
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

function evaluateVM() {
	time_drawing = (end - start) - (end - date_of_last_pickup);

	//$("#time-bar-fluid").removeClass("bar-load-10s-once");

	if(questionCode.indexOf("EZLE") != -1) {
		evaluateEZLE();
	}else if (questionCode.indexOf("FS") != -1) {
		evaluateFS();
	}else if(questionCode.indexOf("FA") != -1) {
		evaluateFA();
	}
	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		//$("#feedback-button").css("display", "block");
		if(questionCode.indexOf("EZLE") == -1) {
			$("#eval-container").css("display", "block");
		}
		feedbackVM();
	}else {
		$("#proceed-button").css("display", "block");
	}
}

function evaluateEZLE() {
	checkPercentage();
	var time = end - start;
	$("#answer"+ questionID + "Time").attr("value", time_drawing);
	$("#answer"+ questionID + "Crossed").attr("value", crossing);
	$("#answer"+ questionID + "Percent").attr("value", 100 - percentage +"%");
	$("#answer"+ questionID + "Target").attr("value", target);
	$("#answer"+ questionID + "Pickups").attr("value", pickups);
	if(100 - percentage == 0 && target) {
		answered_correctly = true;
	}
}

function evaluateFS() {
	checkPercentage();
	checkFields();
	localStorage.setItem("idsm/" + questionCode + "Eval", canvas.toDataURL("image/png"));
	var time = end - start;
	$("#answer"+ questionID + "Time").attr("value", time_drawing);
	$("#answer"+ questionID + "Percent").attr("value", 100 - percentage +"%");
	$("#answer"+ questionID + "FieldsCrossed").attr("value", crossed_fields);
	$("#answer"+ questionID + "FieldsMissed").attr("value", missed_fields);
	$("#answer"+ questionID + "Pickups").attr("value", pickups);
	if(100 - percentage == 0 && missed_fields == 0) {
		answered_correctly = true;
	}
}

function evaluateFA() {
	checkPercentage();
	checkFields();
	localStorage.setItem("idsm/" + questionCode + "Eval", canvas.toDataURL("image/png"));
	var time = end - start;
	$("#answer"+ questionID + "Time").attr("value", time_drawing);
	$("#answer"+ questionID + "Percent").attr("value", 100 - percentage +"%");
	$("#answer"+ questionID + "FieldsCrossed").attr("value", crossed_fields);
	$("#answer"+ questionID + "FieldsMissed").attr("value", missed_fields);
	$("#answer"+ questionID + "Pickups").attr("value", pickups);
	if(100 - percentage == 0 && missed_fields == 0) {
		answered_correctly = true;
	}
}