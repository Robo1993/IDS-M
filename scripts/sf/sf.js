function initSF() {

	unLock();
	//if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$("#clock").css("display", "block");
	//}
	startSF();

	$(".sd_img").click(function(){
		if(locked == false) {
			if($(this).css("background-color") == "rgba(0, 0, 0, 0)") {
				$(this).css({"background-color":"#ccc"});
			}else {
				$(this).css({"background-color":"rgba(0, 0, 0, 0)"});
			}
		}
	});
}

function startSF() {
	start = new Date();
	easeItUp();	
	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$("#feedback-button").css("display", "block");
		$(":root").css("--duration", "15s");
	}else {
		//Clearing Timeout for pausing or stopping auto-proceed
		//var id = setTimeout(function(){alert('hi');}, 3000);
		//clearTimeout(id);
		$(":root").css("--duration", "5s");
		setTimeout(function() {
			locked = true;
			evaluateAA();
			$("#proceed-button").click();
		}, 5000);
	}
	activateClock();
}

function evaluateSF() {
	end = new Date();
	var time_total = end - start;
	//calculate how many items are wrong/correct/left out
	var correct_crossed = $(".sd_correct").filter(function() {
		return $(this).css("background-color") == "rgb(204, 204, 204)";
	}).length;
	var false_crossed = $(".sd_false").filter(function() {
		return $(this).css("background-color") == "rgb(204, 204, 204)";
	}).length;
	var false_left_out = $(".sd_correct").filter(function() {
		return $(this).css("background-color") == "rgba(0, 0, 0, 0)";
	}).length;
	$("#answer"+ questionID +"SymbolsCorrect").attr("value", correct_crossed);
	$("#answer"+ questionID +"SymbolsWrong").attr("value", false_crossed);
	$("#answer"+ questionID +"SymbolsMissed").attr("value", false_left_out);
	$("#answer"+ questionID +"Total").attr("value", correct_crossed - false_crossed);
	$("#answer"+ questionID +"Time").attr("value", time_total);
		
	if(correct_crossed >= (false_left_out + false_crossed)) {
		answered_correctly = true;
	}
}

function feedbackSF() {
	locked = true;
	$("#clock").css("display", "none");
	evaluateSF();

	$(".sd_correct").filter(function() {
	return $(this).css("background-color") == "rgb(204, 204, 204)";
	}).each(function() {
		$(this).css({"background-color":"#cfc"});
	});
	$(".sd_false").filter(function() {
		return $(this).css("background-color") == "rgb(204, 204, 204)";
	}).each(function() {
		$(this).css({"background-color":"#fcc"});
	});
	$(".sd_correct").filter(function() {
		return $(this).css("background-color") == "rgba(0, 0, 0, 0)";
	}).each(function() {
		$(this).addClass("feedback-blink");
	});

	if(questionCode.indexOf("D02") != -1 || questionCode.indexOf("V02") != -1) {
		page_count = 0;
		$(".slide").each(function() {
			$(this).css("display", "none");
		});
		Slide();
	}

	$("#proceed-button").css("display", "block");
}