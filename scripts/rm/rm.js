
let originalDuration = 1200;

function initRM() {

	if (localStorage.getItem('rm/louScreen1')) {
        localStorage.removeItem('rm/louScreen1');
		let src = $(".me-matrix").attr("src").split("/");
        src.splice(src.length - 2, 2);
        let srcS = src.join("/");
        localStorage.setItem('rm/source', srcS);
        const matrix_container = document.getElementById("matrix-container");
        const thumbnail_container = document.getElementById("thumbnail-container");

        matrix_container.remove();
        thumbnail_container.remove();

        //add new img element with 500px width and height
        const img = document.createElement("img");
        srcS = localStorage.getItem('rm/source');
        img.setAttribute("src", srcS + "/4.jpg");
        img.setAttribute("width", "500px");
        img.setAttribute("height", "500px");
        

        img.style.display = "block"; // Set the image as a block-level element
        img.style.margin = "auto"; // Center horizontally using auto margins
        img.style.position = "absolute"; // Positioning for vertical centering
        img.style.top = "50%"; // Align vertically to the middle
        img.style.left = "50%"; // Align horizontally to the middle
        img.style.transform = "translate(-50%, -50%)"; // Center both horizontally and vertically

        document.body.appendChild(img);

        $("#page-load-screen").css("display", "none");
        $("#proceed-button").css("display", "block");
        $("#tp-response-button").css("display", "none");

        localStorage.setItem('rm/louScreen2', 1);
    }
    else if (localStorage.getItem('rm/louScreen2')) {
        localStorage.setItem('rm/endTest', 1);
        localStorage.removeItem('rm/louScreen2');

        const matrix_container = document.getElementById("matrix-container");
        const thumbnail_container = document.getElementById("thumbnail-container");

        matrix_container.remove();
        thumbnail_container.remove();

        // Define srcS or retrieve it from localStorage as needed
        const srcS = localStorage.getItem('rm/source');

        // Check if srcS is defined and not null
        if (srcS) {
        const imageUrls = [
            `${srcS}/5_bearbeitet_ms.jpeg`,
            `${srcS}/7.jpg`,
            `${srcS}/8_bearbeitet_ms.jpg`,
            `${srcS}/3_bearbeitet_ms.jpg`
        ];

        // Create a container div to center the images
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.height = "90vh"; // Center vertically within the viewport

        // Loop through the image URLs and create img elements for each
        imageUrls.forEach(url => {
            const img = document.createElement("img");
            img.className = "lou-img";
            img.src = url;
            img.style.width = "250px";
            img.style.height = "248px"; // Adjust the height as needed

            // Append the img element to the container
            container.appendChild(img);
        });

        // Append the container to the document body or another container
        document.body.appendChild(container); // You can change the parent container here

        // Additional code
        $("#page-load-screen").css("display", "none");
        $("#proceed-button").css("display", "block");
        $("#tp-response-button").css("display", "none");
        } else {
        console.error('srcS is not defined or is null.');
        }
    }

    else if (localStorage.getItem('rm/endTest')) {
        localStorage.removeItem('rm/endTest');
        const matrix_container = document.getElementById("matrix-container");
        const thumbnail_container = document.getElementById("thumbnail-container");

        matrix_container.remove();
        thumbnail_container.remove();
        progressTest();
    }
	else {

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
}

function startRM() {
	unLock();
	timeLimitsRM();
	start = performance.now();
	$("#tp-response-button").css("display", "block");
}

function timeLimitsRM() {
	
	console.log(localStorage.getItem("duration"));
	if (localStorage.getItem("duration")) {
		let progress = (originalDuration - Number(localStorage.getItem("duration"))) / originalDuration * 100;
		setupClock(progress, localStorage.getItem("duration"));
		TimeRestrictions(localStorage.getItem("duration"));
	} else {
		localStorage.setItem("duration", originalDuration);
		setupClock(0, originalDuration);
		TimeRestrictions(originalDuration);
	}
}

//TODO: Add the abort logic
function abortRM() {
	locked = true;
	$("#tp-response-button").css("display", "none");
	$("#clock").css("display", "none");
	$("#answer"+ questionID +"Answer").attr("value", 0);
	$("#answer"+ questionID +"Item").attr("value", "none");
	$("#answer"+ questionID +"Time").attr("value", localStorage.getItem("duration") * 1000);
	localStorage.setItem("rm/louScreen1", 1);
	$("#proceed-button").click();
}

function TimeRestrictions(seconds) {
	setTimeout(abortRM, seconds * 1000);
}

function setupClock(startPercent, duration) {
	$("#clock").css("display", "block");
    const startDegrees = (startPercent / 100) * 360;

	let leftDegrees = startDegrees;
	let rightDegrees = 0;
	
	if (startDegrees > 180) { 
		leftDegrees = 180;
		rightDegrees = startDegrees - 180;
	}

    // Set initial positions
    $(".left > .fill").css({
        'transform': `rotate(${leftDegrees}deg)`,
        'transition': 'none'
    });

    $(".right > .fill").css({
        'transform': `rotate(${rightDegrees}deg)`,
        'transition': 'none'
    });

    // Force reflow
    $(".fill").width();

	$(":root").css("--start-degree-left", leftDegrees + "deg");
	$(":root").css("--start-degree-right", rightDegrees + "deg");

	

    // Calculate remaining duration for animations
    let leftDuration = (180 - leftDegrees) / 180 * (originalDuration/2);
	let rightDuration = (180 - rightDegrees) / 180 * (originalDuration/2);

	console.log(leftDuration, rightDuration);

    // Apply animations with calculated durations
    $(".left > .fill").css({
        'animation': `left ${leftDuration}s linear both`
    });

    $(".right > .fill").css({
        'animation': `right ${rightDuration}s linear both`,
        'animation-delay': `${leftDegrees === 180 ? 0 : leftDuration}s`
    });
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
	let duration = localStorage.getItem("duration");
	let new_duration = duration - time/1000;
	localStorage.setItem("duration", new_duration);

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

