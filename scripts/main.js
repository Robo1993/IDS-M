let locked = true;
let option_selected = false;
let clock_clone;

let ut = "main";

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

const url_adaptive = "https://raw.githubusercontent.com/Robo1993/IDS-M_adaptive_testing/main/";

const menu = "https://survey-1.psychologie.unibas.ch/roman/index.php/365852?lang=de";

const ppvt = "https://survey-1.psychologie.unibas.ch/roman/index.php/243727?lang=de";
const ish = "https://survey-1.psychologie.unibas.ch/roman/index.php/518669?lang=de";
const rg = "https://survey-1.psychologie.unibas.ch/roman/index.php/258331?lang=de";
const fn = "https://survey-1.psychologie.unibas.ch/roman/index.php/984174?lang=en";
const sf = "https://survey-1.psychologie.unibas.ch/roman/index.php/921174?lang=en";
const fw = "https://survey-1.psychologie.unibas.ch/roman/index.php/718389?lang=en";
const me = "https://survey-1.psychologie.unibas.ch/roman/index.php/829952?lang=en";
const aa = "https://survey-1.psychologie.unibas.ch/roman/index.php/481429?lang=en";
const tfz = "https://survey-1.psychologie.unibas.ch/roman/index.php/715445?lang=en";
const vm = "https://survey-1.psychologie.unibas.ch/roman/index.php/891837?lang=de";
const mt = "https://survey-1.psychologie.unibas.ch/roman/index.php/352793?lang=de";
const vm_eval = "https://survey-1.psychologie.unibas.ch/roman/index.php/925914?lang=de"
const end_test = "https://survey-1.psychologie.unibas.ch/roman/index.php/856746?lang=de";
const da = "https://survey-1.psychologie.unibas.ch/roman/index.php/258512?lang=de";
const rm = "https://survey-1.psychologie.unibas.ch/roman/index.php/946666?lang=de";

const test_order = [da, ppvt, ish, rg, fn, sf, fw, me, aa, tfz, vm, mt, vm_eval, rm, end_test];
const test_test_order = [["da", da], ["ppvt", ppvt], ["ish", ish], ["rg", rg], ["fn", fn], ["sf", sf], ["fw", fw], ["me", me], ["aa", aa], ["tfz", tfz], ["vm", vm], ["mt", mt], ["vm_Eval", vm_eval], ["end_test", end_test], ["rm", rm]];
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

			if((questionCode.indexOf("EZLE") != -1 || questionCode.indexOf("FS") != -1 || questionCode.indexOf("FA") != -1) && (questionCode.indexOf("EZLEA") == -1 && questionCode.indexOf("FSA") == -1 && questionCode.indexOf("FAA") == -1)) {
				startVM();
			}else if(questionCode.indexOf("EZLEA") != -1 || questionCode.indexOf("FSA") != -1 || questionCode.indexOf("FAA") != -1) {
				startVMA();
			}else if(questionCode.indexOf("ME") != -1 && questionCode.indexOf("MEA") == -1) {
				startME();
			}else if (questionCode.indexOf("RM") != -1) {
				startRM();
			}else if(questionCode.indexOf("AA") != -1) {
				startAA();
			}else if(questionCode.indexOf("FN") != -1 && questionCode.indexOf("FNA") == -1) {
				startFN();
			}else if(questionCode.indexOf("FW") != -1 && questionCode.indexOf("FWA") == -1) {
				startFW();
			}else if(questionCode.indexOf("SF") != -1) {
				startSF();
			}else if(questionCode.indexOf("TFZ") != -1) {
				startTFZ();
			}else if(questionCode.indexOf("RG") != -1) {
				startRG();
			}else if(questionCode.indexOf("PPVT") != -1) {
				startPPVT();
			}else if(questionCode.indexOf("MEA") != -1) {
				initMEA();
			}else if(questionCode.indexOf("FNA") != -1) {
				startFNA();
			}else if(questionCode.indexOf("FWA") != -1) {
				startFWA();
			} else if(questionCode.indexOf("testAdaptive") != -1) {
				initTestDynamic();
			}
		}

	});

	$("#tp-response-button").on("click", function() {
		if (questionCode.indexOf("testAdaptive") != -1) { 
			evaluateTest();
		}
		if(option_selected) {
			//end = new Date();
			end = performance.now();
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
		if((questionCode.indexOf("EZLE") != -1 || questionCode.indexOf("FS") != -1 || questionCode.indexOf("FA") != -1) && (questionCode.indexOf("EZLEA") == -1 && questionCode.indexOf("FSA") == -1 && questionCode.indexOf("FAA") == -1)) {
			feedbackVM();
		}else if(questionCode.indexOf("EZLEA") != -1 || questionCode.indexOf("FSA") != -1 || questionCode.indexOf("FAA") != -1) {
			feedbackVMA();
		}else if(questionCode.indexOf("ME") != -1 && questionCode.indexOf("MEA") == -1) {
			feedbackME();
		}else if (questionCode.indexOf("RM") != -1) {
			feedbackRM();
		}else if(questionCode.indexOf("AA") != -1) {
			feedbackAA();
		}else if(questionCode.indexOf("FN") != -1 && questionCode.indexOf("FNA") == -1) {
			feedbackFN();
		}else if(questionCode.indexOf("FW") != -1 && questionCode.indexOf("FWA") == -1) {
			feedbackFW();
		}else if(questionCode.indexOf("SF") != -1) {
			feedbackSF();
		}else if(questionCode.indexOf("TFZ") != -1) {
			feedbackTFZ();
		}else if(questionCode.indexOf("RG") != -1) {
			feedbackRG();
		}else if(questionCode.indexOf("MEA") != -1) {
			feedbackMEA();
		}else if(questionCode.indexOf("FNA") != -1) {
			feedbackFN();
		}else if(questionCode.indexOf("FWA") != -1) {
			feedbackFWA();
		}
	});

	$("#next-button").on("click", function() {
		$(this).css("display", "none");
		next();
	});

	$(window).on('resize', function(event) {
		checkOrientation();
	});


	$("#formular-book-button").on("click", function() {
		$("#formular-book").css("display", "flex");
		$("#formular-book").fadeIn();
		$(this).css("display", "none");
	});

	$("#formular-book-cancel").on("click", function() {
		$("#formular-book").fadeOut();
		$("#formular-book-button").css("display", "block");
	});


	$("#sketch-book-button").on("click", function() {
		let comment = $("#answer"+ questionID +"Comment").val();
		let motivation = $("#answer"+ questionID +"Motivation").val();
		$(".motivation-scale-item[name='"+motivation+"'").css("background-color", "#e3e3e3");
		if(comment != "") {
			$("#sketch-book-textarea").val(comment);
			$("#sketch-book-comment").text("Update");
		}else {
			$("#sketch-book-comment").text("Comment");
		}
		$("#sketch-book").css("display", "flex");
		$("#sketch-book").hide();
		$("#sketch-book").fadeIn();
		$(this).css("display", "none");
	});


	$("#sketch-book-cancel").on("click", function() {
		$("#sketch-book").fadeOut();
		$("#sketch-book-button").css("display", "block");
		$(".motivation-scale-item").css('background-color', "");
	});

	$("#sketch-book-comment").on("click", function() {
		let comment = $("#sketch-book-textarea").val();
		let m_s = $('.motivation-scale-item').filter(function(){
										var color = $(this).css("background-color");
										return color === "rgb(227, 227, 227)" ;
									});
		let motivation = ($(m_s).attr("name") != null) ? $(m_s).attr("name") : "";
		$("#sketch-book").fadeOut();
		$("#sketch-book-button").css("display", "block");
		$("#answer"+ questionID +"Comment").attr("value", comment);
		$("#answer"+ questionID +"Motivation").attr("value", motivation);
	});

	$(".motivation-scale-item").on("click", function() {
		let background = $(this).css("background-color");
		if(background == "rgb(227, 227, 227)") {
			$(".motivation-scale-item").css('background-color', "");
		}else {
			$(".motivation-scale-item").css('background-color', "");
			$(this).css("background-color", "#e3e3e3");
		}
	});

	$("#skip-button").on("click", function() {
		showSkip();
	});

	$("#skip-box-input-code").on("input", function() {
		$("#skip-alert-wrong-code").css("display", "none");
	});

	$("#skip-box-reason").on("input", function() {
		$("#skip-alert-no-reason").css("display", "none");
	});

	$("#skip-cancel").on("click", function() {
		hideSkip();
		$("#skip-alert-wrong-code").css("display", "none");
		$("#skip-box-input-code").val("");
	});

	$("#skip-proceed").on("click", function() {
		let code = localStorage.getItem("idsm/code");
		let input = $("#skip-box-input-code").val();
		let reason = $("#skip-box-reason").val();
		let code_check = (input == code || input == '0000') ? true : false;
		let reason_check = (reason != "") ? true : false;
		if(code_check && reason_check) {
			localStorage.setItem("idsm/skip", "true");
			localStorage.setItem("idsm/skip_reason", reason);
			//progressTest();
			//hideSkip();
			skipTest();
		}else {
			if(!code_check) {
				$("#skip-alert-wrong-code").css("display", "block");
				$("#skip-box-input-code").val("");
			}
			if(!reason_check) {
				$("#skip-alert-no-reason").css("display", "block");
			}
		}
	});

	$("#skip-abort").on("click", function() {
		let code = localStorage.getItem("idsm/code");
		let input = $("#skip-box-input-code").val();
		let reason = $("#skip-box-reason").val();
		let code_check = (input == code || input == '0000') ? true : false;
		let reason_check = (reason != "") ? true : false;
		if(code_check && reason_check) {
			window.location.replace(test_order[test_order.length - 1]);
			localStorage.clear();
		}else {
			if(!code_check) {
				$("#skip-alert-wrong-code").css("display", "block");
				$("#skip-box-input-code").val("");
			}
			if(!reason_check) {
				$("#skip-alert-no-reason").css("display", "block");
			}
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

	clock_clone = $("#clock").clone(true)[0];

	let test_code = getTestCodeFormal();
	$("#sketch-book-test-code").text(test_code);

	if(questionCode.indexOf("Q") != -1 || questionCode.indexOf("H") != -1 && questionCode.indexOf("ISH") == -1) {
		$("#skip-button").css("display", "none");
		$(".answers").css("display", "flex");
	}
	if(questionCode.indexOf("StartQ03") != -1) {
		$('input[name=' + questionID + ']:checked').removeAttr("checked");
	}

	if(questionCode.indexOf("V") != -1 && questionCode.indexOf("VM") == -1 && questionCode.indexOf("PPVT") == -1) {
		$("#repeat-svg").css("display", "inline");
		expertIndication();
	}else {
		$("#proceed-svg").css("display", "inline");
	}

	// Important! 
	// temporarily for changing Gender Label Text
	$("label:contains('Keine Antwort')").text("Anderes");
	$("label:contains('No answer')").text("Anderes");

	if(questionCode.indexOf("StartI01") != -1) {
		localStorage.clear();
		localStorage.setItem("idsm/aa", "false");
		localStorage.setItem("idsm/fn", "false");
		localStorage.setItem("idsm/fw", "false");
		localStorage.setItem("idsm/me", "false");
		localStorage.setItem("idsm/rg", "false");
		localStorage.setItem("idsm/sf", "false");
		localStorage.setItem("idsm/tfz", "false");
		localStorage.setItem("idsm/vm", "false");
		localStorage.setItem("idsm/vm_Eval", "false");
		localStorage.setItem("idsm/ppvt", "false");
		localStorage.setItem("idsm/ish", "false");
		localStorage.setItem("idsm/mt", "false");
		localStorage.setItem("idsm/da", "false")
		localStorage.setItem("idsm/rm", "false");
	}

	if(questionCode.indexOf("I98") != -1) {
		displayISHNumber();
	}

	if (questionCode.indexOf("StartI97") != -1) {

		let birthdate = localStorage.getItem("idsm/birthdate");

		var parts = birthdate.split('.');
		var formattedBirthdate = `${parts[2]}-${parts[1]}-${parts[0]}`;
	
		// Parse the formatted birthdate
		var birthDate = new Date(formattedBirthdate);
		
		// Get today's date
		var today = new Date();
	
		// Calculate initial age based on year difference
		var age = today.getFullYear() - birthDate.getFullYear();
	
		// Adjust age if today's date is before the birthdate in the current year
		if (today.getMonth() < birthDate.getMonth() - 1 || 
		   (today.getMonth() === birthDate.getMonth() - 1 && today.getDate() < birthDate.getDate())) {
			age--;
		}

		$("#answer"+ questionID + "Age").attr("value", age);
		console.log(age);
	}

	if(questionCode.indexOf("I99") != -1) {
		// if(localStorage.getItem("idsm/order_counter")) {
		// 	order_counter = localStorage.getItem("idsm/order_counter");
		// }else {
		// 	order_counter = 0;
		// }
		progressTest();
	}else if(questionCode.indexOf("Menu") != -1) {
		horizontalAlert();
		let last_test = getUrlParameter("lasttest");
		localStorage.setItem("idsm/" + last_test, "true");
		$("#buttons-top-middle .btn").css("display", "none")
		$("#external-button").css("display", "block");
		$("#formular-book-button").css("display", "block");
		let test_code = getTestCode();
		localStorage.setItem("idsm/" + test_code, "true");
		$("#ids-m-menu-box").css("display", "flex");
		$("#sketch-book-button").css("display", "block");
		initMenu();
		$("#answer"+ questionID + "Code").attr("value", localStorage.getItem("idsm/code"));
		$("#answer"+ questionID + "Test").attr("value", last_test);
		$("#answer"+ questionID + "SkipReason").attr("value", localStorage.getItem("idsm/skip_reason"));
		$("#background-banner").css("display", "block");
		$("#page-load-screen").css("display", "none");
		reLock();
	}else {
		//start = new Date();
		start = performance.now();
		initialize();
	}
}

function skipTest() {
	$(".answers input").each(function() {
		$(this).val("skipped");
	});
	$(".answers textarea").each(function() {
		$(this).val("skipped");
	});
	let testcode = getTestCode();
	let menu_url = menu + "&lasttest=" +testcode;
	window.location.href = menu_url;
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
		} else if(questionCode.indexOf("testAdaptive") != -1) {
			initTestDynamic();
		}
		else {
			unLock();
			$("#proceed-button").css("display", "block");
		}
	}else if(questionCode.indexOf("Menu") != -1) {
		$("#background-banner").css("display", "block");
		initMenu();
		unLock();
	}else if(questionCode.indexOf("Lou") != -1) {
		unLock();
		$("#proceed-button").css("display", "block");
	}else {
		if(questionCode.indexOf("ME") != -1 && questionCode.indexOf("MEA") == -1) {
			initME();
		}else if (questionCode.indexOf("RM") != -1) {
			initRM();
		}else if(questionCode.indexOf("PPVT") != -1) {
			initPPVT();
		}else if((questionCode.indexOf("EZLE") != -1 || questionCode.indexOf("FS") != -1 || questionCode.indexOf("FA") != -1) && (questionCode.indexOf("EZLEA") == -1 && questionCode.indexOf("FSA") == -1 && questionCode.indexOf("FAA") == -1)) {
			initVM();
		}else if(questionCode.indexOf("EZLEA") != -1 || questionCode.indexOf("FSA") != -1 || questionCode.indexOf("FAA") != -1) {
			initVMA();
		}else if(questionCode.indexOf("FN") != -1 && questionCode.indexOf("FNA") == -1) {
			initFN();
		}else if(questionCode.indexOf("SF") != -1) {
			initSF();
		}else if(questionCode.indexOf("AA") != -1) {
			initAA();
		}else if(questionCode.indexOf("TFZ") != -1) {
			initTFZ();
		}else if(questionCode.indexOf("FW") != -1 && questionCode.indexOf("FWA") == -1) {
			initFW();
		}else if(questionCode.indexOf("RG") != -1) {
			initRG();
		}else if(questionCode.indexOf("ISH") != -1) {
			initISH();
		}else if(questionCode.indexOf("MT") != -1) {
			initMT();
		}else if(questionCode.indexOf("MEA") != -1) {
			initMEA();
		}else if(questionCode.indexOf("FNA") != -1) {
			initFNA();
		}else if(questionCode.indexOf("FWA") != -1) {
			initFWA();
		} 
	}
}

function initMenu() {
	let aa_menu = localStorage.getItem("idsm/aa");
	let fn_menu = localStorage.getItem("idsm/fn");
	let fw_menu = localStorage.getItem("idsm/fw");
	let me_menu = localStorage.getItem("idsm/me");
	let rg_menu = localStorage.getItem("idsm/rg");
	let sf_menu = localStorage.getItem("idsm/sf");
	let tfz_menu = localStorage.getItem("idsm/tfz");
	let vm_menu = localStorage.getItem("idsm/vm");
	let vm_Eval_menu = localStorage.getItem("idsm/vm_Eval");
	let ppvt_menu = localStorage.getItem("idsm/ppvt");
	let ish_menu = localStorage.getItem("idsm/ish");
	let mt_menu = localStorage.getItem("idsm/mt");
	let da_menu = localStorage.getItem("idsm/da");
	let rm_menu = localStorage.getItem("idsm/rm");
	let test_battery = [["aa", aa_menu], ["fn", fn_menu], ["fw", fw_menu], ["me", me_menu], ["rg", rg_menu], ["sf", sf_menu], ["tfz", tfz_menu], ["vm", vm_menu], ["vm_Eval", vm_Eval_menu],["ppvt", ppvt_menu], ["ish", ish_menu], ["mt", mt_menu], ["da", da_menu], ["rm", rm_menu]];

	test_battery.forEach(function (test, index) {
		let ppvt_test = getByIndex(test_battery, "ppvt");
		let ish_test = getByIndex(test_battery, "ish");
		let rg_test = getByIndex(test_battery, "rg");
		let sf_test = getByIndex(test_battery, "sf");
		let pre_conditions = false;
		// if(test[0] != "ppvt" && test[0] != "ish" && test[0] != "rg") {
		// 	if(ppvt_test[1] == "true" && ish_test[1] == "true" && rg_test[1] == "true") {
		// 		if(test[0] == "aa" && sf_test[1] == "true") {
		// 			pre_conditions = true;
		// 		}else if(test[0] != "aa") {
		// 			pre_conditions = true;
		// 		}
		// 	}
		// }else {
			pre_conditions = true;
		//}

		if (test[0] != "ish") {
			if (localStorage.getItem("idsm/ish") == "false") {
				pre_conditions = false;
			}
			else {
				pre_conditions = true;
			}
		}

		if (test[0] == "vm_Eval") {
			if (localStorage.getItem("idsm/vm") == "false") {
				pre_conditions = false;
			}
			else {
				pre_conditions = true;
			}
		}

		if (test[0] == "aa") {
			if (localStorage.getItem("idsm/sf") == "false") {
				pre_conditions = false;
			}
			else {
				pre_conditions = true;
			}
		}

		if (test[0] == "da") {
			pre_conditions = true;
		}

		/*if (test[0] == "mt") {
			pre_conditions = true;
			for (let i = 0; i < test_battery.length; i++) {
				if (test_battery[i][0] != "da" && test_battery[i][0] != "mt" && test_battery[i][1] == "false") {
					console.log(test_battery[i][0]);
					pre_conditions = false;
					break;
				}
			}
		}*/


		if(test[1] == "false" && pre_conditions == true) {
			$("#" + test[0] + " .bi-x-circle-fill").parent().parent().addClass("test-box-hover");
			$("#" + test[0] + " .bi-x-circle-fill").css("display", "block");
			$("#" + test[0]).on("click", function() {
				test_test_order.forEach(function(item, index) {
					if(item[0] == test[0]) {
						window.location.replace(item[1]);
					}
				});
			});
		}else if(test[1] == "false" && pre_conditions == false) {
			$("#" + test[0] + " .bi-x-circle-fill").css("display", "block");
			$("#" + test[0] + " .bi-x-circle-fill").parent().parent().css("background-color", "#ddd");
		}else {
			$("#" + test[0] + " .bi-check-circle-fill").css("display", "block");
			$("#" + test[0] + " .bi-x-circle-fill").parent().parent().css("background-color", "#ddd");
		}
	});
	$("#ids-m-menu-box").css("display", "flex");
}

function getByIndex(d_array, str) {
	let returner;
	d_array.forEach(function(item, index) {
		if(item[0] == str) {
			returner = item;
		}
	});
	return returner;
}

function pasteAnswers() {
	if(questionCode.indexOf("ME") != -1 && questionCode.indexOf("MEA") == -1) {
		evaluateME();
	}else if (questionCode.indexOf("RM") != -1) {
		evaluateRM();
	}else if((questionCode.indexOf("EZLE") != -1 || questionCode.indexOf("FS") != -1 || questionCode.indexOf("FA") != -1) && (questionCode.indexOf("EZLEA") == -1 && questionCode.indexOf("FSA") == -1 && questionCode.indexOf("FAA") == -1)) {
		evaluateVM();
	}else if(questionCode.indexOf("EZLEA") != -1 || questionCode.indexOf("FSA") != -1 || questionCode.indexOf("FAA") != -1) {
		evaluateVMA();
	}else if(questionCode.indexOf("FN") != -1 && questionCode.indexOf("FNA") == -1) {
		evaluateFN();
	}else if(questionCode.indexOf("SF") != -1) {
		evaluateSF();
	}else if(questionCode.indexOf("AA") != -1) {
		evaluateAA();
	}else if(questionCode.indexOf("TFZ") != -1) {
		evaluateTFZ();
	}else if(questionCode.indexOf("FW") != -1 && questionCode.indexOf("FWA") == -1) {
		evaluateFW();
	}else if(questionCode.indexOf("RG") != -1) {
		evaluateRG();
	}else if(questionCode.indexOf("PPVT") != -1) {
		evaluatePPVT();
	}else if(questionCode.indexOf("MEA") != -1) {
		evaluateMEA();
	}else if(questionCode.indexOf("FNA") != -1) {
		evaluateFNA();
	}else if(questionCode.indexOf("FWA") != -1) {
		evaluateFWA();
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
	if(questionCode.indexOf("ME") != -1 && questionCode.indexOf("MEA") == -1) {
		nextME();
	}else if (questionCode.indexOf("RM") != -1) {
		nextRM();
	}else if((questionCode.indexOf("EZLE") != -1 || questionCode.indexOf("FS") != -1 || questionCode.indexOf("FA") != -1) && (questionCode.indexOf("EZLEA") == -1 && questionCode.indexOf("FSA") == -1 && questionCode.indexOf("FAA") == -1)) {
		nextVM();
	}else if(questionCode.indexOf("EZLEA") != -1 || questionCode.indexOf("FSA") != -1 || questionCode.indexOf("FAA") != -1) {
		nextVMA();
	}else if(questionCode.indexOf("FN") != -1 && questionCode.indexOf("FNA") == -1) {
		nextFN();
	}else if(questionCode.indexOf("SF") != -1) {
		nextSF();
	}else if(questionCode.indexOf("AA") != -1) {
		nextAA();
	}else if(questionCode.indexOf("TFZ") != -1) {
		nextTFZ();
	}else if(questionCode.indexOf("FW") != -1 && questionCode.indexOf("FWA") == -1) {
		nextFW();
	}else if(questionCode.indexOf("RG") != -1) {
		nextRG();
	}else if(questionCode.indexOf("MEA") != -1) {
		nextMEA();
	}else if(questionCode.indexOf("FWA") != -1) {
		nextFWA();
	} else if (questionCode.indexOf("testAdaptive") != -1) {
		evaluateTest(); 
		$("#proceed-button").css("display", "block");
	}
}

function checkOrientation() {
	if($("#ids-m-menu-box").css("display") != "none") {
		horizontalAlert();
	}else if(questionCode.indexOf("I99") != -1) {
		horizontalAlert();
	}else if((questionCode.indexOf("EZLE") != -1 || questionCode.indexOf("FS") != -1 || questionCode.indexOf("AA") != -1 || questionCode.indexOf("ME") != -1 || questionCode.indexOf("MEA") != -1 || questionCode.indexOf("TFZ") != -1 || questionCode.indexOf("FW") != -1 || questionCode.indexOf("FWA") != -1 || questionCode.indexOf("PPVT") != -1 || questionCode.indexOf("ISH") != -1) && questionCode.indexOf("FAA") == -1 || questionCode.indexOf("RM") != -1) {
		horizontalAlert();
	}else if(questionCode.indexOf("FA") != -1 || questionCode.indexOf("FN") != -1 || questionCode.indexOf("RG") != -1) {
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
	// let counter_counter = parseInt(order_counter);
	// order_counter++;
	// localStorage.setItem("idsm/order_counter", order_counter);
	// window.location.replace(test_order[counter_counter]);
	// horizontalAlert();
	// $("#buttons-top-middle .btn").css("display", "none")
	// let test_code = getTestCode();
	// localStorage.setItem("idsm/" + test_code, "true");
	// $("#ids-m-menu-box").css("display", "flex");
	// $("#sketch-book-button").css("display", "block");
	// initMenu();
	// $("#background-banner").css("display", "block");
	// $("#page-load-screen").css("display", "none");
	// reLock();
	let testcode = getTestCode();
	let menu_url = menu + "&lasttest=" + testcode;
	window.location.href = menu_url;
}

function expertIndication() {
	//$("#test-layout").css("box-sizing", "border-box");
	//$("#test-layout").css("border", "1rem solid #a5d7d2");
	$("body").css("background-color", "#cbfffa");
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
	}else if(questionCode.indexOf("StartQ04") != -1) {
		let input = $("#answer"+ questionID).val();
		localStorage.setItem("idsm/version", input);
	}
}

function fillInDemographics() {
	let code = localStorage.getItem("idsm/code");
	let birthdate = localStorage.getItem("idsm/birthdate");
	let gender = localStorage.getItem("idsm/gender");
	let version = localStorage.getItem("idsm/version");
	if(gender == "") {
		gender = "other"
	}
	$("#answer"+ questionID + "Code").attr("value", code);
	$("#answer"+ questionID + "Birthdate").attr("value", birthdate);
	$("#answer"+ questionID + "Gender").attr("value", gender);
	$("#answer"+ questionID + "Version").attr("value", version);
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
	$("#tp-area").css("display", "flex");
	$("#center-area").css("display", "none");
	$(".question-text").css("opacity", "1");
	$(".question-text").css("display", "blockac");
	$("#page-load-screen").css("display", "none");
}

function reLock() {
	locked = true;
	//$(".question-text").css("opacity", "0");
	$(".question-text").css("display", "none");
	$("#tp-area").css("display", "none");
	//$("#center-area").css("display", "flex");
	$("#clock").css("display", "none");
	$("#speed").css("display", "none");
}

function showSkip() {
	$("#skip-alert").css("display", "block");
	$("#skip-alert").css("display", "flex");
	$("#skip-alert").hide();
	$("#skip-alert").fadeIn(400);
	const unfinished_tests = []
	let unfinished = false;
	if (localStorage.getItem("idsm/aa") == "false") {
		unfinished_tests.push("Aufmerksamkeit Aufteilen");
		unfinished = true;
	}
	if (localStorage.getItem("idsm/fn") == "false") {
		unfinished_tests.push("Figuren Nachlegen");
		unfinished = true;
	}
	if (localStorage.getItem("idsm/fw") == "false") {
		unfinished_tests.push("Figuren Wiedererkennen");
		unfinished = true;
	}
	if (localStorage.getItem("idsm/me") == "false") {
		unfinished_tests.push("Matrizen Ergänzen");
		unfinished = true;
	}
	if (localStorage.getItem("idsm/rg") == "false") {
		unfinished_tests.push("Reaktionsgeschwindigkeit");
		unfinished = true;
	}
	if (localStorage.getItem("idsm/sf") == "false") {
		unfinished_tests.push("Symbole Finden");
		unfinished = true;
	}
	if (localStorage.getItem("idsm/tfz") == "false") {
		unfinished_tests.push("Tierfarben Zuordnen");
		unfinished = true;
	}
	if (localStorage.getItem("idsm/vm") == "false") {
		unfinished_tests.push("Visuomotorik");
		unfinished = true;
	}
	if (localStorage.getItem("idsm/vm_Eval") == "false") {
		unfinished_tests.push("Visuomotorik Evaluation");
		unfinished = true;
	}
	if (localStorage.getItem("idsm/ppvt") == "false") {
		unfinished_tests.push("PPVT");
		unfinished = true;
	}
	if (localStorage.getItem("idsm/ish") == "false") {
		unfinished_tests.push("Ishihara");
		unfinished = true;
	}
	if (localStorage.getItem("idsm/mt") == "false") {
		unfinished_tests.push("Mitarbeit in der Testsituation");
		unfinished = true;
	}
	if (localStorage.getItem("idsm/da") == "false") {
		unfinished_tests.push("Demographische Angaben");
		unfinished = true;
	}

	if (localStorage.getItem("idsm/rm") == "false") {
		unfinished_tests.push("Raven Matrizen");
		unfinished = true;
	}

	if (unfinished && getTestCode() === undefined) {
		document.getElementById("unfinished-tests").innerText = "Sie haben folgende Tests noch nicht bearbeitet: \n" + unfinished_tests.join(", ");
	}
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

function activateSpeed() {
	$(".right > .fill").addClass("rotate-right");
	$(".left > .fill").addClass("rotate-left");
}

function deActivateSpeed() {
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
	let slash = "/index.php";
	let path_array = path.split(slash, 1);
	let root = path_array[0];
	return root;
}

function getTestCode() {
	if(questionCode.indexOf("AA") != -1) {
		return "aa";
	}else if(questionCode.indexOf("FN") != -1 && questionCode.indexOf("FNA") == -1) {
		return "fn";
	}else if(questionCode.indexOf("FW") != -1 && questionCode.indexOf("FWA") == -1) {
		return "fw";
	}else if(questionCode.indexOf("ME") != -1 && questionCode.indexOf("MEA") == -1) {
		return "me";
	}else if (questionCode.indexOf("RM") != -1) {
		return "rm";
	}else if(questionCode.indexOf("RG") != -1) {
		return "rg";
	}else if(questionCode.indexOf("SF") != -1) {
		return "sf";
	}else if(questionCode.indexOf("TFZ") != -1) {
		return "tfz";
	}else if (questionCode.indexOf("VE") != -1) {
		return "vm_Eval";
	}else if(questionCode.indexOf("VM") != -1) {
		return "vm";
	}else if(questionCode.indexOf("PPVT") != -1) {
		return "ppvt";
	}else if(questionCode.indexOf("ISH") != -1) {
		return "ish";
	}else if(questionCode.indexOf("MT") != -1) {
		return "mt";
	}else if(questionCode.indexOf("MEA") != -1) {
		return "mea";
	}else if(questionCode.indexOf("FWA") != -1) {
		return "fwa";
	}
}

function getTestCodeFormal() {
	if(questionCode.indexOf("AA") != -1) {
		return "Aufmerksamkeit aufteilen";
	}else if(questionCode.indexOf("FN") != -1 && questionCode.indexOf("FNA") == -1) {
		return "Figuren nachlegen";
	}else if(questionCode.indexOf("FW") != -1 && questionCode.indexOf("FWA") == -1) {
		return "Figuren wiedererkennen";
	}else if(questionCode.indexOf("ME") != -1 && questionCode.indexOf("MEA") == -1) {
		return "Matrizen ergänzen";
	}else if (questionCode.indexOf("RM") != -1) {
		return "Raven Matrizen";
	}else if(questionCode.indexOf("RG") != -1) {
		return "Reaktiongeschwindigkeit";
	}else if(questionCode.indexOf("SF") != -1) {
		return "Symbole finden";
	}else if(questionCode.indexOf("TFZ") != -1) {
		return "Tierfarben zuordnen";
	}else if(questionCode.indexOf("VM") != -1) {
		return "Visuomotorik";
	}else if(questionCode.indexOf("PPVT") != -1) {
		return "PPVT";
	}else if(questionCode.indexOf("ISH") != -1) {
		return "Ishihara";
	}else if(questionCode.indexOf("MT") != -1) {
		return "Mitarbeit in der Testsituation";
	}else if(questionCode.indexOf("VM_Eval") != -1) {
		return "Visuomotorik Evaluation";
	}else if(questionCode.indexOf("MEA") != -1) {
		return "Matrizen ergänzen - adaptiv";
	}
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

function displayISHNumber() {
	var paragraph = document.getElementById("ISH_Number");
	var number = localStorage.getItem("idsm/ISHCounter");
	paragraph.textContent += number;
	paragraph.textContent += "/11";
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};