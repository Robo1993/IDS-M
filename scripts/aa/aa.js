let audioCommit = document.createElement("audio");
let animalSounds = document.createElement("audio");
let playTime;
let horse_hit_counter = 0;
let animal_sounds_list = [];
let how_many_horses = 0;
let correctly_identified_horses = 0;
let mistakenly_identified_horses = 0;
let animal_disabler = false;
let transition_time = 0;
let page_count = 0;
let tid;
let rt_start;
let rt_end;
let animal_reaction_time = [];
let animals_count = 0;

function initAA() {

	if(questionCode.indexOf("0UB") != -1) {
		animalSounds.setAttribute("src", serverPath + "/upload/themes/survey/IDS-M/files/audio/aa/animal_sounds.mp3")
		unLock();
		$("#media-play-button").css("display", "block");
		if(questionCode.indexOf("D00") != -1) {
			$("#proceed-button").css("display", "block");
		}
	}else {
		if(questionCode.indexOf("D01") != -1 || questionCode.indexOf("V01") != -1) {
			$("#clock").css("display", "block");
			unLock();
			startAA();
		}else if(questionCode.indexOf("D02") != -1 || questionCode.indexOf("V02") != -1) {
			$("#clock").css("display", "block");
			$("#horse-button").css("display", "block");
			//initSlider();
			calcTransition();
			unLock();
			locked = true;
			animal_disabler = true;
			$(".slide").first().css("display", "block");
			$("#media-play-button").css("display", "block");
		}else {
			$("#clock").css("display", "block");
			//initSlider();
			calcTransition();
			$("#play-button").css("display", "block");
			$("#page-load-screen").css("display", "none");
		}

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

	$("#horse-button").on("click", function() {
		let correct_horse_button = false;
		let background = $("#horse-button").css("background-color");
		//let active = (background == "rgb(245, 151, 161)" || background == "rgb(153, 210, 167)") ? true: false;
		if(!animal_disabler) {
			let current_time = new Date();
			if(horse_hit_counter == 1) {
				rt_end = new Date();
				audioCommit.play();
				if(animalSounds.currentTime >= 10 && animalSounds.currentTime < 14) {
					correctly_identified_horses++;
					correct_horse_button = true;
					animal_reaction_time.push(current_time - rt_start);
				}else {
					mistakenly_identified_horses++;
				}
				if(questionCode.indexOf("AA0UBD") != -1 || questionCode.indexOf("AA0UBV") != -1) {
					if(correct_horse_button) {
						$("#horse-button").css("background-color", "#99d2a7");
					}else {
						$("#horse-button").css("background-color", "#F597A1");
					}
					// setTimeout(function() {
					// 	if(active) {
					// 		$("#horse-button").css("background-color", "#fff");
					// 	}
					// 	active = false;
					// }, 2500);
				}else {
					$("#horse-button").css("background-color", "#ccc");
				}
				horse_hit_counter--;
			}
		}
	});

	$("#media-play-button").on("click", function() {
		if(questionCode.indexOf("D00") != -1) {
			animalSounds.currentTime = 10;
			var playPromise = $(animalSounds).trigger("play");

			if (playPromise !== undefined) {
				setTimeout(function() {
					$(animalSounds).trigger("pause");
					animalSounds.currentTime = 0;
				}, 2500);
			}
		}else {
			$("#time-pointer").addClass("time-pointer-animation-infinite");
			$("#media-play-button").css("display", "none");
			locked = false;
			animal_disabler = false;
			startAA();
		}
	});
}

function startAA() {

	easeItUp();
	start = new Date();
	calcAnimals();

	if($("#animal-sounds").length) {
		activateClock();
		$("#horse-button").css("display", "block");

		$.each($("#animal-sounds").text().split(","), function(index, item) {
		    animal_sounds_list.push(item);
		});

		audioCommit.setAttribute("src", serverPath + "/upload/themes/survey/IDS-M/files/audio/button_audio/Commit/commit.mp3");
		animalSounds.setAttribute("src", serverPath + "/upload/themes/survey/IDS-M/files/audio/aa/animal_sounds.mp3")

		animalSounds.addEventListener("ended", function() {
			locked = true;
			animal_disabler = true;
			if((questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) && questionCode.indexOf("0UB") == -1) {
				$("#feedback-button").css("display", "block");
				$("#time-pointer").removeClass("time-pointer-animation-infinite");
			}else {
				evaluateAA();
				$("#proceed-button").css("display", "block");
			}
		});

		//animalSounds.onloadeddata = function() {
			renderAudio();
			Slide();
		//};
	}else {
		activateClock();
		$("#feedback-button").css("display", "block");
	}
}

function calcAnimals() {
	if($("#animal-sounds").length) {
		let string = $("#animal-sounds").text();
		let letters = string.split(",");
		animals_count = letters.length;
		$(":root").css("--duration", animals_count * 2.5 + "s");
	}else {
		$(":root").css("--duration", "5s");
	}
}

function feedbackAA() {
	locked = true;
	$("#clock").css("display", "none");
	evaluateAA();

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

function easeItUp() {
	$(".sd_table").find("td").each(function() {
		if(getFileNameAA($(this).find("img").attr("src")) == "correct") {
			$(this).find("img").addClass("sd_correct");
		} else if(getFileNameAA($(this).find("img").attr("src")) == "dist") {
			$(this).find("img").addClass("sd_false");
		}
	});
	$(".sd_table").find("tr").each(function() {
		var tds = $(this).children().length;
		var displayWidth = $(".question-container").width-90;
		var imgWidth = displayWidth / tds;
		$(".sd_img").css({"width":imgWidth+"px"});
	});
}

function calcTransition()  {
	let pages = $(".slide").length;
	let sounds = $("#animal-sounds").text().split(",").length;
	transition_time = (sounds * 2500) / pages;
}

function Slide() {
	let slide = $(".slide")[page_count];
	let last_slide = $(".slide")[page_count - 1];
	page_count++;
	$(last_slide).css("display", "none");
	$(slide).css("display", "block");
	tid = setTimeout(TransitionSlide, transition_time);
}

function TransitionSlide() {
	let slide = $(".slide")[page_count];
	let last_slide = $(".slide")[page_count - 1];
	page_count++;
	$(last_slide).css("display", "none");
	$(slide).css("display", "block");
	if(page_count == $(".slide").length) {
		abortTimeout();
	}else {
		tid = setTimeout(TransitionSlide, transition_time);
	}
}

function abortTimeout() {
	clearTimeout(tid);
}

function getFileNameAA(src) {
	if(src) {
		var name1 = src.replace( /^.*?([^\/]+)\..+?$/, '$1' );
		var name2 = name1.replace(/[0-9]/g, '');
		return name2;
	}
}

function evaluateAA() {
	end = new Date();
	var time_total = end - start;
	//calculate how many items are wrong/correct/left out
	let correct_crossed = "";
	let correct_crossed_total = 0;
	$("#slides").children(".slide").each(function(e) {
		let x = $(this).find(".sd_correct").filter(function() {
			return $(this).css("background-color") == "rgb(204, 204, 204)";
		}).length;
		correct_crossed_total = correct_crossed_total + x;
		correct_crossed = correct_crossed + x + ";";
	});

	let false_left_out = "";
	let false_left_out_total = 0;
	$("#slides").children(".slide").each(function(e) {
		let x = $(this).find(".sd_correct").filter(function() {
			return $(this).css("background-color") == "rgba(0, 0, 0, 0)";
		}).length;
		false_left_out_total = false_left_out_total + x;
		false_left_out = false_left_out + x + ";";
	});

	let false_crossed = "";
	let false_crossed_total = 0;
	$("#slides").children(".slide").each(function(e) {
		let x = $(this).find(".sd_false").filter(function() {
			return $(this).css("background-color") == "rgb(204, 204, 204)";
		}).length;
		false_crossed_total = false_crossed_total + x;
		false_crossed = false_crossed + x + ";";
	});

	$("#answer"+ questionID +"SymbolsCorrect").attr("value", correct_crossed_total);
	$("#answer"+ questionID +"SymbolsWrong").attr("value", false_crossed_total);
	$("#answer"+ questionID +"SymbolsMissed").attr("value", false_left_out_total);
	$("#answer"+ questionID +"Total").attr("value", correct_crossed_total - false_crossed_total);
	$("#answer"+ questionID +"Time").attr("value", time_total);
	if($("#animal-sounds")) {
		let arts = "";
		animal_reaction_time.forEach(rt => arts = arts + rt + ";");
		$("#answer"+ questionID +"SymbolsCorrectPage").attr("value", correct_crossed);
		$("#answer"+ questionID +"SymbolsWrongPage").attr("value", false_crossed);
		$("#answer"+ questionID +"SymbolsMissedPage").attr("value", false_left_out);
		$("#answer"+ questionID +"AnimalReactionTime").attr("value", arts);
		$("#answer"+ questionID +"AnimalsCorrect").attr("value", correctly_identified_horses);
		$("#answer"+ questionID +"AnimalsWrong").attr("value", mistakenly_identified_horses);
		$("#answer"+ questionID +"AnimalsMissed").attr("value", how_many_horses - correctly_identified_horses);
	}
		
	if(correct_crossed >= (false_left_out + false_crossed)) {
		answered_correctly = true;
	}
}

function renderAudio() {
	$(animalSounds).trigger("play");
	playTime = new Date() - 2500;

	animalSounds.ontimeupdate = function() {audioLoop()};
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

function audioLoop() {
	let currentTime = new Date();
	let time_passed = currentTime - playTime;
	let sound = animal_sounds_list[0];
	if(time_passed > 2500) {
		//if($("#horse-button").css("background-color") == "rgb(204, 204, 204)") {
			$("#horse-button").css("background-color", "#fff");
		//}
		playTime = new Date();
		if(sound == "B") {
			animalSounds.currentTime = 14.2;
			rt_start = new Date();
			horse_hit_counter = 1;
		}else if(sound == "D") {
			animalSounds.currentTime = 2.9;
			rt_start = new Date();
			horse_hit_counter = 1;
		}else if(sound == "H") {
			animalSounds.currentTime = 10.3;
			rt_start = new Date();
			horse_hit_counter = 1;
			how_many_horses++;
		}else if(sound == "L") {
			animalSounds.currentTime = 6.35;
			rt_start = new Date();
			horse_hit_counter = 1;
		}else if(!sound) {
			animalSounds.currentTime = animalSounds.duration;
		}
		animal_sounds_list.shift();
	}
}