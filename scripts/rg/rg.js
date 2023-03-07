//const standard_delay = [2422, 893, 4970, 3281, 547, 4340, 1436, 2182, 1268, 1318, 378, 1710, 383, 4698, 2338, 3178, 253, 700, 2007, 2004, 2516, 3879, 4888, 449, 2714, 521, 2857, 3800, 2751, 1929, 1498, 46, 2294, 4862, 3641, 4423, 2844, 1888, 2477, 2951];
const standard_delay = [2422, 893, 4970, 3281, 547, 4340, 1436, 2182, 1268, 1318, 378, 1710, 383, 4698, 2338, 3178, 253, 700, 2007, 2004];
const demo_delay = [1268, 547, 2422, 3281, 4970, 1436, 2338, 700, 2004, 2751];
const pseudo_delay = [0];
let delay;
let item = 0;
let counter;
let restart = false;
let tap_counter = 0;
let false_positives = 0;
let reaction_times = new Array();
let sun_start;

function initRG() {
	if(questionCode.indexOf("H") != -1) {
		$("#item-area").css("transform", "rotate(180deg)");
		unLock();
		$("#proceed-button").css("display", "block");
	}else {
		if(questionCode.indexOf("D00") != -1 || questionCode.indexOf("V00") != -1) {
			delay = pseudo_delay;
		}else if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
			//$("#speed").css("display", "block");
			delay = demo_delay;
		}else {
			delay = standard_delay;
		}

		counter = delay.length;

		$("#play-button").css("display", "block");
		$("#play-button").click();
		$("#page-load-screen").css("display", "none");

		$("#sun-img").on("click", function() {
			let sun_end = performance.now();
			let reaction_time = sun_end - sun_start;
			reaction_times.push(reaction_time);
			item++;
			$(this).fadeOut(0);

			if(item >= counter) {
				$(this).fadeOut(0);
				$("#crossair").fadeOut(400);
				evaluateRG();
			}else {
				nextLoad();
			}
		});

		$("#crossair").on("click", function() {
			tap_counter++;
			if(tap_counter >= 5) {
				restart = true;
				item = 0;
				reaction_times = [];
				$("#sun-img").css("display", "none");
				tap_counter = 0;
				false_positives = 0;
				reLock();
				$("#play-button").css("display", "block");
				$("#play-button").click();
				$("#center-area").css("display", "block");
				$("#warning-restart").css("display", "block");
			}else {
				false_positives++;
			}
		});
	}
}

function startRG() {
	if(restart) {
		restart = false;
	}
	unLock();
	nextLoad();
}

function feedbackRG() {
	
}

function evaluateRG() {
	for (i = 0; i < counter; i++) {
		$("#answer"+ questionID + (i + 1)).attr("value", reaction_times[i]);
	}
	$("#answer"+ questionID + "falseClicks").attr("value", false_positives);
	$("#proceed-button").css("display", "block");
}

function nextLoad() {
	if(!restart) {
		let time_out;
		time_out = delay[item];
		setTimeout(function() {
			if(!restart) {
				tap_counter = 0;
				sun_start = performance.now();
				$("#sun-img").fadeIn(0);
			}
		}, time_out);
	}
}