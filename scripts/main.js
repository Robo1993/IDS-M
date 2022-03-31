let locked = true;
let option_selected = false;

let questionID;
let questionCode;
let serverPath;

let answered_correctly = false;

let start;
let end;

let audioRight = document.createElement("audio");
let audioWrong = document.createElement("audio");

let rotation_counter = 0;

let prevent = false;

let feedback_mode = false;

const ppvt = "https://survey-1.psychologie.unibas.ch/roman/index.php/243727?lang=de";
const ish = "https://survey-1.psychologie.unibas.ch/roman/index.php/518669?lang=de";
const rg = "https://survey-1.psychologie.unibas.ch/roman/index.php/258331?lang=de";
const fn = "https://survey-1.psychologie.unibas.ch/roman/index.php/971433?lang=en";
const sf = "https://survey-1.psychologie.unibas.ch/roman/index.php/921174?lang=en";
const fw = "https://survey-1.psychologie.unibas.ch/roman/index.php/718389?lang=en";
const me = "https://survey-1.psychologie.unibas.ch/roman/index.php/262884?lang=en";
const aa = "https://survey-1.psychologie.unibas.ch/roman/index.php/481429?lang=en";
const tfz = "https://survey-1.psychologie.unibas.ch/roman/index.php/715445?lang=en";
const vm = "https://survey-1.psychologie.unibas.ch/roman/index.php/891837?lang=de";
const mt = "https://survey-1.psychologie.unibas.ch/roman/index.php/352793?lang=de";
const vm_eval = "https://survey-1.psychologie.unibas.ch/roman/index.php/925914?lang=de"
const end_test = "https://survey-1.psychologie.unibas.ch/roman/index.php/856746?lang=de";
const test_order = [ppvt, ish, rg, fn, sf, fw, me, aa, tfz, vm, mt, vm_eval, end_test];
let order_counter = localStorage.getItem("idsm/order_counter");

$( document ).ready(function() {

	// Images loaded is zero because we're going to process a new set of images.
	var imagesLoaded = 0;
	// Total images is still the total number of <img> elements on the page.
	var totalImages = $("img").length;

	// Step through each image in the DOM, clone it, attach an onload event
	// listener, then set its source to the source of the original image. When
	// that new image has loaded, fire the imageLoaded() callback.
	$("img").each(function (idx, img) {
		$("<img>").on("load", imageLoaded).attr("src", $(img).attr("src"))
	});

	// Do exactly as we had be1 -- increment the loaded count and if all are
	// loaded, call the allImagesLoaded() function.
	function imageLoaded() {
		imagesLoaded++
		if (imagesLoaded == totalImages) {
			allImagesLoaded()
		}
	}

	function allImagesLoaded() {
		setup();
	}

	$("#proceed-button").on("click", function() {
		if(questionCode.indexOf("StartQ") != -1) {
			captureDemographics();
		}
		$("#ls-button-submit").click();
	});

	$("#play-button").on("click", function() {
		if(questionCode.indexOf("I01") != -1) {
			if(questionCode.indexOf("EndI01") != -1) {
				localStorage.clear();
			}
			$("#ls-button-submit").click();
		}else {
			$(this).css("display", "none");
			unLock();

			if(questionCode.indexOf("EZLE") != -1 || questionCode.indexOf("FS") != -1 || questionCode.indexOf("FA") != -1) {
				startVM();
			}else if(questionCode.indexOf("ME") != -1) {
				startME();
			}else if(questionCode.indexOf("AA") != -1) {
				startAA();
			}else if(questionCode.indexOf("FN") != -1) {
				startFN();
			}else if(questionCode.indexOf("FW") != -1) {
				startFW();
			}else if(questionCode.indexOf("SF") != -1) {
				startSF();
			}else if(questionCode.indexOf("TFZ") != -1) {
				startTFZ();
			}else if(questionCode.indexOf("RG") != -1) {
				startRG();
			}else if(questionCode.indexOf("PPVT") != -1) {
				startPPVT();
			}
		}

	});

	$("#tp-response-button").on("click", function() {
		if(option_selected) {
			end = new Date();
			locked = true;
			$("#clock").css("display", "none");
			$(this).css("display", "none");
			pasteAnswers();
		}
	});

	$("#feedback-button").on("click", function() {
		feedback_mode = true;
		$(this).css("display", "none");
		$("#proceed-button").css("display", "block");
		$("#tp-response-button").css("display", "none");
		if(questionCode.indexOf("EZLE") != -1 || questionCode.indexOf("FS") != -1 || questionCode.indexOf("FA") != -1) {
			feedbackVM();
		}else if(questionCode.indexOf("ME") != -1) {
			feedbackME();
		}else if(questionCode.indexOf("AA") != -1) {
			feedbackAA();
		}else if(questionCode.indexOf("FN") != -1) {
			feedbackFN();
		}else if(questionCode.indexOf("FW") != -1) {
			feedbackFW();
		}else if(questionCode.indexOf("SF") != -1) {
			feedbackSF();
		}else if(questionCode.indexOf("TFZ") != -1) {
			feedbackTFZ();
		}else if(questionCode.indexOf("RG") != -1) {
			feedbackRG();
		}
	});

	$("#next-button").on("click", function() {
		$(this).css("display", "none");
		next();
	});

	$(window).on('resize', function(event) {
		checkOrientation();
	});

	$("#skip-button").on("click", function() {
		showSkip();
	});

	$("#skip-box-input-code").on("input", function() {
		$("#skip-alert-wrong-code").css("display", "none");
	});

	$("#skip-cancel").on("click", function() {
		hideSkip();
		$("#skip-alert-wrong-code").css("display", "none");
		$("#skip-box-input-code").val("");
	});

	$("#skip-proceed").on("click", function() {
		// Do Stuff
		let cancel_password = "Abbrechen";
		let code = localStorage.getItem("idsm/code");
		let input = $("#skip-box-input-code").val();
		if(input == code) {
			progressTest();
		}else {
			$("#skip-alert-wrong-code").css("display", "block");
			$("#skip-box-input-code").val("");
		}
	});

	$("#skip-abort").on("click", function() {
		let code = localStorage.getItem("idsm/code");
		let input = $("#skip-box-input-code").val();
		if(input == code) {
			window.location.replace(test_order[test_order.length - 1]);
		}else {
			$("#skip-alert-wrong-code").css("display", "block");
			$("#skip-box-input-code").val("");
		}
	});

});

function setup() {

	document.addEventListener("touchstart", function() {},false);
	
	questionID = $("input[name='lastanswer']").attr("value");
	questionCode = $("#question-code").text().trim();
	serverPath = getURLStuff(window.location.pathname);

	audioRight.setAttribute("src", serverPath + "/upload/themes/survey/IDS-M/files/audio/button_audio/Correct/right.wav");
	audioWrong.setAttribute("src", serverPath + "/upload/themes/survey/IDS-M/files/audio/button_audio/Wrong/wrong.wav");

	checkOrientation();

	if(questionCode.indexOf("Q") != -1 || questionCode.indexOf("H") != -1 && questionCode.indexOf("ISH") == -1) {
		$("#skip-button").css("display", "none");
		$(".answers").css("display", "flex");
	}

	if(questionCode.indexOf("V") != -1 && questionCode.indexOf("VM") == -1 && questionCode.indexOf("PPVT") == -1) {
		$("#repeat-svg").css("display", "inline");
	}else {
		$("#proceed-svg").css("display", "inline");
	}

	// Important! 
	// temporarily for changing Gender Label Text
	$("label:contains('Keine Antwort')").text("Anderes");
	$("label:contains('No answer')").text("Anderes");

	if(questionCode.indexOf("StartI01") != -1) {
		localStorage.clear();
	}

	if(questionCode.indexOf("I99") != -1) {
		if(localStorage.getItem("idsm/order_counter")) {
			order_counter = localStorage.getItem("idsm/order_counter");
		}else {
			order_counter = 0;
		}
		progressTest();
	}else {
		start = new Date();
		initialize();
	}
}

function initialize() {
	if((questionCode.indexOf("I") != -1 || questionCode.indexOf("Q") != -1) && (questionCode.indexOf("ISH") == -1 || questionCode.indexOf("ISHI") != -1)) {
		if(questionCode.indexOf("I01") != -1 && questionCode.indexOf("UB") == -1 && questionCode.indexOf("SFT") == -1 && questionCode.indexOf("EZLE") == -1 && questionCode.indexOf("FS") == -1 && questionCode.indexOf("FA") == -1) {
			$("#background-banner").css("display", "block");
			$("#play-button").css("display", "block");
			locked = false;
			$(".question-text").css("opacity", "1");
			$("#page-load-screen").css("display", "none");
			fillInDemographics();
		}else {
			unLock();
			$("#proceed-button").css("display", "block");
		}
	}else if(questionCode.indexOf("Lou") != -1) {
		unLock();
		$("#proceed-button").css("display", "block");
	}else {
		if(questionCode.indexOf("ME") != -1) {
			initME();
		}else if(questionCode.indexOf("PPVT") != -1) {
			initPPVT();
		}else if(questionCode.indexOf("EZLE") != -1 || questionCode.indexOf("FS") != -1 || questionCode.indexOf("FA") != -1) {
			initVM();
		}else if(questionCode.indexOf("FN") != -1) {
			initFN();
		}else if(questionCode.indexOf("SF") != -1) {
			initSF();
		}else if(questionCode.indexOf("AA") != -1) {
			initAA();
		}else if(questionCode.indexOf("TFZ") != -1) {
			initTFZ();
		}else if(questionCode.indexOf("FW") != -1) {
			initFW();
		}else if(questionCode.indexOf("RG") != -1) {
			initRG();
		}else if(questionCode.indexOf("ISH") != -1) {
			initISH();
		}else if(questionCode.indexOf("MT") != -1) {
			initMT();
		}
	}
}

function pasteAnswers() {
	if(questionCode.indexOf("ME") != -1) {
		evaluateME();
	}else if(questionCode.indexOf("EZLE") != -1 || questionCode.indexOf("FS") != -1 || questionCode.indexOf("FA") != -1) {
		evaluateVM();
	}else if(questionCode.indexOf("FN") != -1) {
		evaluateFN();
	}else if(questionCode.indexOf("SF") != -1) {
		evaluateSF();
	}else if(questionCode.indexOf("AA") != -1) {
		evaluateAA();
	}else if(questionCode.indexOf("TFZ") != -1) {
		evaluateTFZ();
	}else if(questionCode.indexOf("FW") != -1) {
		evaluateFW();
	}else if(questionCode.indexOf("RG") != -1) {
		evaluateRG();
	}else if(questionCode.indexOf("PPVT") != -1) {
		evaluatePPVT();
	}
}

function feedback() {
	$("#clock").css("display", "none");
	if(answered_correctly) {
		$("body").css("background-color", "#99d2a7");
		//audioRight.onload = function() {
          audioRight.play();
        //}
	}else {
		$("body").css("background-color", "#F597A1");
		//audioWrong.onload = function() {
          audioWrong.play();
        //}
	}
}

function next() {
	if(questionCode.indexOf("ME") != -1) {
		nextME();
	}else if(questionCode.indexOf("EZLE") != -1 || questionCode.indexOf("FS") != -1 || questionCode.indexOf("FA") != -1) {
		nextVM();
	}else if(questionCode.indexOf("FN") != -1) {
		nextFN();
	}else if(questionCode.indexOf("SF") != -1) {
		nextSF();
	}else if(questionCode.indexOf("AA") != -1) {
		nextAA();
	}else if(questionCode.indexOf("TFZ") != -1) {
		nextTFZ();
	}else if(questionCode.indexOf("FW") != -1) {
		nextFW();
	}else if(questionCode.indexOf("RG") != -1) {
		nextRG();
	}
}

function checkOrientation() {
	if(questionCode.indexOf("FS") != -1 || questionCode.indexOf("AA") != -1 || questionCode.indexOf("ME") != -1 || questionCode.indexOf("TFZ") != -1 || questionCode.indexOf("FW") != -1 || questionCode.indexOf("PPVT") != -1 || questionCode.indexOf("ISH") != -1) {
		horizontalAlert();
	}else if(questionCode.indexOf("EZLE") != -1 || questionCode.indexOf("FA") != -1 || questionCode.indexOf("FN") != -1 || questionCode.indexOf("RG") != -1) {
		verticalAlert();
	}else if(questionCode.indexOf("SF") != -1) {
		if(questionCode.indexOf("1UB") != -1) {
			horizontalAlert();
		}else if(questionCode.indexOf("2UB") != -1) {
			verticalAlert();
		}else if(questionCode.indexOf("3UB") != -1) {
			horizontalAlert();
		}else if(questionCode.indexOf("4UB") != -1) {
			verticalAlert();
		}else if(questionCode.indexOf("T") != -1) {
			verticalAlert();
		}else {
			horizontalAlert();
		}
	}
}

function progressTest() {
	let counter_counter = parseInt(order_counter);
	order_counter++;
	localStorage.setItem("idsm/order_counter", order_counter);
	window.location.replace(test_order[counter_counter]);
}

function captureDemographics() {
	if(questionCode.indexOf("StartQ01") != -1) {
		let input = $("#answer"+ questionID).val();
		localStorage.setItem("idsm/code", input);
	}else if(questionCode.indexOf("StartQ02") != -1) {
		let input = $("#answer"+ questionID).val();
		localStorage.setItem("idsm/birthdate", input);
	}else if(questionCode.indexOf("StartQ03") != -1) {
		let input = $('input[name=' + questionID + ']:checked').val();
		localStorage.setItem("idsm/gender", input);
	}
}

function fillInDemographics() {
	let code = localStorage.getItem("idsm/code");
	let birthdate = localStorage.getItem("idsm/birthdate");
	let gender = localStorage.getItem("idsm/gender");
	if(gender == "") {
		gender = "other"
	}
	$("#answer"+ questionID + "Code").attr("value", code);
	$("#answer"+ questionID + "Birthdate").attr("value", birthdate);
	$("#answer"+ questionID + "Gender").attr("value", gender);
}

function horizontalAlert() {
	if(window.innerHeight > window.innerWidth) {
		$("#orientation-img-h").css("display", "block");
		$("#orientation-alert").css("display", "flex");
		$("#orientation-alert").hide();
		$("#orientation-alert").fadeIn(400);
	}else {
		$("#orientation-alert").fadeOut(400);
		$("#orientation-img-h").css("display", "none");
	}
}

function verticalAlert() {
	if(window.innerHeight < window.innerWidth) {
		$("#orientation-img-v").css("display", "block");
		$("#orientation-alert").css("display", "flex");
		$("#orientation-alert").hide();
		$("#orientation-alert").fadeIn(400);
	}else {
		$("#orientation-alert").fadeOut(400);
		$("#orientation-img-v").css("display", "none");
	}
}

function whichButton() {
	if(questionCode.indexOf("I") != -1) {
		unLock();
		$("#proceed-button").css("display", "block");
	}else if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$("#play-button").css("display", "block");
	}
}

function unLock() {
	locked = false;
	$("#center-area").css("display", "none");
	$(".question-text").css("opacity", "1");
	$("#page-load-screen").css("display", "none");
}

function reLock() {
	locked = true;
	$(".question-text").css("opacity", "0");
	$("#center-area").css("display", "flex");
}

function showSkip() {
	$("#skip-alert").css("display", "block");
	$("#skip-alert").css("display", "flex");
	$("#skip-alert").hide();
	$("#skip-alert").fadeIn(400);
}

function hideSkip() {
	$("#skip-alert").fadeOut(400);
}

function activateClock() {
	$(".right > .fill").addClass("rotate-right");
	$(".left > .fill").addClass("rotate-left");
}

function deActivateClock() {
	$(".right > .fill").removeClass("rotate-right");
	$(".left > .fill").removeClass("rotate-left");
}

//checking if survey runs on testserver or productionserver
function getURLStuff(path) {
	//let name = "";
	// if(path.includes("limesurvey")) {
	// 	name = "/limesurvey2";
	// } else if(path.includes("quest")) {
	// 	name = "/quest";
	// }
	let slash = "/";
	let path_array = path.split("/", 2);
	let root = path_array[1];
	return "/" + root;
}

function getQuestionBlock() {
	if(questionCode.indexOf("0UB") != -1) {
		return 0;
	}else if(questionCode.indexOf("1UB") != -1) {
		return 1;
	}else if(questionCode.indexOf("2UB") != -1) {
		return 2;
	}else if(questionCode.indexOf("3UB") != -1) {
		return 3;
	}else if(questionCode.indexOf("4UB") != -1) {
		return 4;
	}else if(questionCode.indexOf("T") != -1) {
		return 5;
	}
}

function getQuestionType() {
	if(questionCode.indexOf("UBI") != -1 || questionCode.indexOf("TI") != -1) {
		return "I";
	}else if(questionCode.indexOf("UBD") != -1 || questionCode.indexOf("TD") != -1 || questionCode.indexOf("UBV") != -1 || questionCode.indexOf("TV") != -1) {
		return "D";
	}else if(questionCode.indexOf("Q") != -1) {
		return "Q";
	}else {
		return "F";
	}
}