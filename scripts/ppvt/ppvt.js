let audioPPVT = document.createElement("audio");
let seta = [3,2,1,4];
let setb = [2,3,4,1];
let set1 = [2,1,3,4,2,4,3,4,2,2,1,2];
let set2 = [1,1,4,1,4,3,3,4,4,1,4,2];
let set3 = [1,3,4,3,1,1,3,4,3,2,4,4];
let set4 = [1,3,1,1,2,3,1,3,2,3,4,2];
let set5 = [1,3,1,4,3,1,1,3,1,4,2,3];
let set6 = [1,1,2,4,4,1,4,1,1,2,4,3];
let set7 = [4,1,3,3,4,1,2,3,1,1,3,2];
let set8 = [4,4,4,1,3,2,1,2,1,4,3,1];
let set9 = [4,2,4,2,3,4,1,4,2,4,3,3];
let set10 = [1,4,4,1,2,3,3,4,1,4,4,2];
let set11 = [2,3,3,1,3,2,2,1,3,2,1,4];
let set12 = [1,2,3,3,3,2,2,1,2,4,1,2];
let set13 = [3,4,4,1,3,4,1,1,3,1,2,4];
let set14 = [2,1,3,1,4,2,1,4,2,3,4,2];
let set15 = [4,3,2,1,4,4,2,3,1,3,2,2];
let set16 = [4,4,1,2,4,2,1,1,4,3,4,2];
let set17 = [4,1,3,2,1,2,4,1,4,3,2,2];
let set18 = [4,1,4,2,4,3,2,4,4,3,3,1];
let set19 = [3,2,3,3,1,4,4,2,1,3,3,4];
let sets = [set1, set2, set3, set4, set5, set6, set7, set8, set9, set10, set11, set12, set13, set14, set15, set16, set17, set18, set19, seta, setb];
let working_set = [];
let item_counter = 0;
let item_src = "";
let age = "";
let last_set = 0;
let set = 0;
let end_ppvt = 0;
let reverse = 0;
let one_click = false;
let mistakes = 0;
let bottom_set = 0;
let top_set = 0;
let point_of_return = 0;

function initPPVT() {
	$("#ppvt-table").css("display", "none");
	last_set = parseInt($("#ppvt-last-set").text());
	end_ppvt = parseInt($("#ppvt-end").text());
	bottom_set = parseInt($("#ppvt-bottom-set").text());
	top_set = parseInt($("#ppvt-top-set").text());
	reverse = parseInt($("#ppvt-reverse-set").text());
	point_of_return = parseInt($("#ppvt-point-of-return").text());
	if(reverse != 0 && bottom_set == 0) {
		set = last_set - 1;
	}else if(reverse != 0 && bottom_set != 0) {
		set = point_of_return + 1;
		reverse = 0;
	}else {
		set = last_set + 1;
	}
	age = parseInt($("#ppvt-age").text());

	//what set???!!!!
	if(questionCode.indexOf("PPVT01") != -1) {
		if(age < 4) {
			working_set = set1;
			set = 1;
		}else if(age == 4) {
			working_set = set2;
			set = 2;
		}else if(age == 5) {
			working_set = set4;
			set = 4;
		}else if(age == 6) {
			working_set = set5;
			set = 5;
		}else if(age == 7) {
			working_set = set6;
			set = 6;
		}else if(age == 8) {
			working_set = set7
			set = 7;
		}else if(age == 9) {
			working_set = set8
			set = 8;
		}else if(age > 9 && age < 12) {
			working_set = set9;
			set = 9;
		}else if(age > 11 && age < 14) {
			working_set = set10;
			set = 10;
		}else if(age > 13) {
			working_set = set11
			set = 11;
		}
	}else if(questionCode.indexOf("PPVT1a") != -1) {
		working_set = seta;
		set = "a";
	}else if(questionCode.indexOf("PPVT1b") != -1) {
		working_set = setb;
		set = "b";
	}else if(questionCode.indexOf("Q") == -1 && questionCode.indexOf("I") == -1 && questionCode.indexOf("Lou") == -1) {
		working_set = sets[set - 1];
	}

	$(".ppvt-img").on("click", function() {
		$("td").each(function() {
			$(this).css("background-color", "");
		});
		let p = $(this).parent();
		p.css("background-color", "#ccc");
		option_selected = true;
		$("#tp-response-button").css("display", "block");
	});

	$("#media-play-button").on("click", function() {
		audioPPVT.play();
	});

	setupPPVT();
}

function setupPPVT() {
	locked = false;
	$("#center-area").css("display", "none");
	$(".question-text").css("opacity", "1");
	fillInImg();
}

function startPPVT() {
	audioPPVT.setAttribute("src", serverPath + "/upload/themes/survey/IDS-M/files/audio/ppvt/set" + set + "/" + item_counter + ".mp3");
	$("#ppvt-table").css("display", "block");
	audioPPVT.play();

	audioPPVT.addEventListener("ended", function() {
		$("#media-play-button").css("display", "none");
	});

	// audioPPVT.addEventListener("ended", function() {
	// 	$("#tp-response-button").css("display", "block");
	// });
}

function proceedPPVT() {
	//whats the next Set, cancel or switch?
	$("#answer"+ questionID + "Set").attr("value", set);

	if(bottom_set == 0 && mistakes <= 1) {
		bottom_set = set;
	}
	if(top_set == 0 && mistakes >= 8) {
		top_set = set;
	}
	if(point_of_return == 0 && mistakes > 1) {
		point_of_return = set;
	}
	if(mistakes > 1 && bottom_set == 0) {
		reverse = 1;
	}else if(mistakes <= 1) {
		reverse = 0;
	}else if(mistakes > 1 && mistakes < 8 && bottom_set != 0) {
		reverse = 0;
	}
	if(bottom_set != 0 && top_set != 0 || set == 1 && mistakes >= 8) {
		end_ppvt = 1;
	}
	if((set == "a" || set == "b") && mistakes > 2) {
		end_ppvt = 1;
	}
	if(top_set == 0 && set == 19) {
		end_ppvt = 1;
		top_set = set;
	}

	$("#answer"+ questionID + "Bottomset").attr("value", bottom_set);
	$("#answer"+ questionID + "Topset").attr("value", top_set);
	$("#answer"+ questionID + "End").attr("value", end_ppvt);
	$("#answer"+ questionID + "Reverse").attr("value", reverse);
	$("#answer"+ questionID + "Return").attr("value", point_of_return);
	$("#ls-button-submit").click();
}

function fillInImg() {
	let img_counter = 1;
	$(".ppvt-img").each(function() {
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

function evaluatePPVT() {
	$("#tp-response-button").css("display", "none");
	let item_src = "";
	$("td").each(function() {
		if($(this).css("background-color") == "rgb(204, 204, 204)") {
			item_src = $(this).children().first().attr("src");
		}
		$(this).css("background-color", "");
	});
	

	$("#ppvt-table").css("display", "none");
	$("#page-load-screen").css("display", "block");
	if(item_counter >= 12 && (set != "a" || set != "b")) {
		calculateAnswer(item_src);
		proceedPPVT();
	}else if(item_counter >= 4 && (set == "a" || set == "b")) {
		calculateAnswer(item_src);
		proceedPPVT();
	}else {
		calculateAnswer(item_src);
		fillInImg();
	}

}

function calculateAnswer(src) {
	//calculate answer
	let src_split = src.split("/");
	let file = src_split[src_split.length - 1]
	let img_number_split = file.split(".");
	let img_number = parseInt(img_number_split[0]);
	let working_set_img_number = working_set[item_counter - 1];
	//fill in answers
	if(img_number == working_set_img_number) {
		$("#answer"+ questionID + item_counter).attr("value", 1);
	}else {
		mistakes++;
		$("#answer"+ questionID + item_counter).attr("value", 0);
	}
}

function symbole(file) {
	var s= file.replace(/\\/g, '/');
	s= s.substring(s.lastIndexOf('/')+ 1);
	let filename = file? s.replace(/[?#].+$/, ''): s.split('.')[0];
	return filename.split(".")[0];
}