let clicked = false;
let answer_box;
let button_exceptions = ["1UBV01", "1UBV03", "1UBV05", "2UBV01", "2UBV02", "2UBV03", "2UBV05", "2UBV06", "2UBV07", "2UBV09", "2UBV10", "2UBV11", "3UBV001", "3UBV002", "3UBV003", "3UBV005", "3UBV006", "3UBV007", "3UBV009", "3UBV010", "3UBV011"];

function initTFZ() {

	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1 || questionCode.indexOf("BE") != -1) {
		$(":root").css("--duration", "15s");
	}else {
		$(":root").css("--duration", "5s");
	}
	//if(questionCode.indexOf("E") == -1) {
		$("#speed").css("display", "block");
	//}

	button_exceptions.forEach(function(e) {
		if(questionCode.indexOf(e) != -1) {
			$("#proceed-svg").css("display", "inline");
			$("#repeat-svg").css("display", "none");
		}
	});

	unLock();

	if(questionCode.indexOf("UBE") != -1) {
		$("#proceed-button").css("display", "block");
	}
	activateSpeed();
	//start = new Date();
	start = performance.now();

	$(".tnRadio").click(function() {
		if(!option_selected) {
			if(questionCode.indexOf("D") == -1 && questionCode.indexOf("V") == -1) {
				option_selected = true;
			}
			$("#clock").css("display", "none");
			answer_box = $(this);
			$(".tnRadio").each(function(e) {
				$(this).css("border", "0");
			});
			$(this).css("border", "10px solid #000");
			evaluateTFZ();
		}
	});

}

//checks if the selected color matches to the questions animal
function evaluateTFZ() {
	//var colorAnswer = getFileName(source);
	var color = answer_box.css("background-color")
	var colorAnswer = getAnswerColor(color);
	var fileName = getFileName($(".tierfarben-img").attr("src"));
	var animalName = getAnimalName(fileName);
	var animalColor = checkAnimalColor(animalName);
	var end = performance.now();
	var duration = end - start;
	var total;
	var result;
	var feed_back;

	// if(animalColor == "sw") {
	// 	animalColor = checkAnimalColor(animalName);
	// }
	if(colorAnswer == animalColor) {
		answered_correctly = true;
		result = 1;
	}else {
		answered_correctly = false;
		result = 0;
		//total = 
	}

	$("#answer"+ questionID +"Answer").attr("value", result);
	$("#answer"+ questionID +"Time").attr("value", duration);
	//move to next question
	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$("#feedback-button").css("display", "block");
	}else {
		$("#ls-button-submit").click();
	}
}

function feedbackTFZ() {
	option_selected = true;
	feedback();
}

function getCorrectColor(animalColor) {
	var color;
	//Übungsblock 1
	if(animalColor == "brown") {
		color = "rgb(177, 120, 75)";
	}else if(animalColor == "violet") {
		color = "rgb(162, 89, 206)";
	}
	//Übungsblock 2
	if(animalColor == "grey") {
		color = "rgb(168, 185, 193)";
	}else if(animalColor == "black") {
		color = "rgb(68, 68, 66)";
	}else if(animalColor == "pink") {
		color = "rgb(239, 126, 146)";
	}else if(animalColor == "orange") {
		color = "rgb(236, 136, 76)";
	}
	//Testungsblock
	if(animalColor == "blue") {
		color = "rgb(90, 155, 211)";
	}else if(animalColor == "green") {
		color = "rgb(112, 173, 70)";
	}else if(animalColor == "yellow") {
		color = "rgb(255, 192, 0)";
	}else if(animalColor == "red") {
		color = "rgb(254, 0, 0)";
	}
	return color;
}

//returns the color of a black/white animal based on normal colors
function checkAnimalColor(animalName) {
	var animalColor = "";
	if (animalName == "Deer") {
		animalColor = "brown";
	} else if(animalName == "Octopus") {
		animalColor = "violet";
	} else if(animalName == "Elephante") {
		animalColor = "grey";
	} else if(animalName == "Penguin") {
		animalColor = "black";
	} else if(animalName == "Flamingo") {
		animalColor = "pink";
	} else if(animalName == "Tiger") {
		animalColor = "orange";
	} else if(animalName == "Dolphin") {
		animalColor = "blue";
	} else if(animalName == "Frog") {
		animalColor = "green";
	} else if(animalName == "Chick") {
		animalColor = "yellow";
	} else if(animalName == "Bug") {
		animalColor = "red";
	}
	return animalColor;
}

function getAnswerColor(colorCode) {
	//1 Übungsblock
	if(colorCode == "rgb(177, 120, 75)") {
		return "brown";
	}else if(colorCode == "rgb(162, 89, 206)") {
		return "violet";
	}
	//2 Übungsblock
	if(colorCode == "rgb(168, 185, 193)") {
		return "grey";
	}else if(colorCode == "rgb(239, 126, 146)") {
		return "pink";
	}else if(colorCode == "rgb(68, 68, 66)") {
		return "black";
	}else if(colorCode == "rgb(236, 136, 76)") {
		return "orange";
	}
	//Testungsblock
	if(colorCode == "rgb(90, 155, 211)") {
		return "blue";
	}else if(colorCode == "rgb(112, 173, 70)") {
		return "green";
	}else if(colorCode == "rgb(255, 192, 0)") {
		return "yellow";
	}else if(colorCode == "rgb(254, 0, 0)") {
		return "red";
	}
}

//Cptn Obvious
function getFileName(src) {
	var name = src.replace( /^.*?([^\/]+)\..+?$/, '$1' );
	return name;
}

//Cptn Obvious
function getAnimalName(fileName) {
	var set = fileName.split("_");
	var animalName = set[0];
	return animalName;
}

//Cptn Obvious
function getAnimalColor(fileName) {
	var set = fileName.split("_");
	var animalColor = set[set.length - 1];
	return animalColor;
}

function getQuestionNr() {
	if(getQuestionType() == "D") {
		if(questionCode.indexOf("UB") != -1) {
			return parseInt(questionCode.substring(5));
		}else if(questionCode.indexOf("TFZT") != -1) {
			return parseInt(questionCode.substring(3));
		}
	}else {
		if(questionCode.indexOf("UB") != -1) {
			return parseInt(questionCode.substring(4));
		}else if(questionCode.indexOf("TFZT") != -1) {
			return parseInt(questionCode.substring(2));
		}
	}
}