test_url_adaptive = "https://raw.githubusercontent.com/adgohar/IDS-M-adaptive/main/";
test_items = [];

function initMEA() {
    url_items = test_url_adaptive + "me.csv";
    loadLogicTree();

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

    if (!localStorage.getItem('me-adaptive/nextItem')) {
        var random_item = Math.floor(Math.random() * 3) + 1;
        var next_item = random_item;
        var current_item = random_item;
        localStorage.setItem('me-adaptive/currentItem', current_item);
    }
    else {
        var next_item = parseInt(localStorage.getItem('me-adaptive/nextItem'));
        var current_item = parseInt(localStorage.getItem('me-adaptive/nextItem'));
        localStorage.setItem('me-adaptive/currentItem', current_item);
    }
    console.log("current_item: " + current_item);

    function loadLogicTree() {
		readItemsCSV(url_items)
        .then(itemDict => {
            test_items = itemDict;
            loadQuestion(current_item);
        })
        .catch(error => {
            console.error('Error:', error);
        });    
    }
    function readItemsCSV(csv) {
        return fetch(csv)
        .then(response => response.text())
        .then(csvText => {
            const lines = csvText.split("\n");
            const headers = lines[0].split(",").map(header => header.trim());
            const itemDict = {};
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(",").map(value => value.trim());
                const itemNumber = parseInt(values[0]);
                const time = parseInt(values[1]);
                const matrixUrl = values[2];
                const first_img = values[3];
                const second_img = values[4];
                const third_img = values[5];
                const fourth_img = values[6];
                const fifth_img = values[7];
                itemDict[itemNumber] = {
                    matrixUrl,
                    time,
                    first_img,
                    second_img,
                    third_img,
                    fourth_img,
                    fifth_img,
                };
            }
            return itemDict;
        });
    }
}

function startMEA() {
	unLock();
	start = performance.now();
	$("#tp-response-button").css("display", "block");
    $("#clock").css("display", "block");
	timeLimitsMEA();
    activateClock();
}

function timeLimitsMEA() {
    let current_item = parseInt(localStorage.getItem('me-adaptive/currentItem'));
    var itemObject = test_items[current_item];
    var time = itemObject.time;
	$(":root").css("--duration", time +"ms");
	setTimeout(function() {
		if(!locked) {
			end = performance.now();
			evaluateMEA();
		}
	}, time);
}

function feedbackMEA() {
	if(!answered_correctly) {
		$(".me-thumbnail").filter(function() {
			return $(this).attr("src").indexOf("correct") != -1;
		}).addClass("feedback-blink");
	}
	feedback();
}

function loadQuestion(questionNumber) {
	if (localStorage.getItem('me-adaptive/louScreen1')) {
        localStorage.removeItem('me-adaptive/louScreen1');
        const matrix_container = document.getElementById("matrix-container");
        const thumbnail_container = document.getElementById("thumbnail-container");

        matrix_container.remove();
        thumbnail_container.remove();

        //add new img element with 500px width and height
        const img = document.createElement("img");
        const srcS = localStorage.getItem('me-adaptive/source');
        img.setAttribute("src", srcS + "/images/4.jpg");
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

        localStorage.setItem('me-adaptive/louScreen2', 1);
    }
    else if (localStorage.getItem('me-adaptive/louScreen2')) {
        localStorage.setItem('me-adaptive/endTest', 1);
        localStorage.removeItem('me-adaptive/louScreen2');

        const matrix_container = document.getElementById("matrix-container");
        const thumbnail_container = document.getElementById("thumbnail-container");

        matrix_container.remove();
        thumbnail_container.remove();

        // Define srcS or retrieve it from localStorage as needed
        const srcS = localStorage.getItem('me-adaptive/source');

        // Check if srcS is defined and not null
        if (srcS) {
        const imageUrls = [
            `${srcS}/images/5_bearbeitet_ms.jpeg`,
            `${srcS}/images/7.jpg`,
            `${srcS}/images/8_bearbeitet_ms.jpg`,
            `${srcS}/images/3_bearbeitet_ms.jpg`
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

    else if (localStorage.getItem('me-adaptive/endTest')) {
        localStorage.removeItem('me-adaptive/endTest');
        const matrix_container = document.getElementById("matrix-container");
        const thumbnail_container = document.getElementById("thumbnail-container");

        matrix_container.remove();
        thumbnail_container.remove();
        progressTest();
    }
    else {
        let img_counter = 0;
        const itemNumber = parseInt(questionNumber);
        var itemObject = test_items[itemNumber];
        var picture = itemObject.matrixUrl;
        let imgs = [itemObject.first_img, itemObject.second_img, itemObject.third_img, itemObject.fourth_img, itemObject.fifth_img];
        let src = $(".me-matrix").attr("src").split("/");
        src.splice(src.length - 2, 2);
        let srcS = src.join("/");
        localStorage.setItem('me-adaptive/source', srcS);
        $(".me-matrix").attr("src", srcS + "/images/me" + itemNumber + "/" + picture);
        $("#thumbnail-container img").each(function() {
            if(imgs[img_counter] == "none" || imgs[img_counter] == "" || !imgs[img_counter]) {
                $(this).remove();
                img_counter++;
            }
            else {
                $(this).attr("src", srcS + "/images/me" + itemNumber + "/" + imgs[img_counter]);
                img_counter++;
            }
        });
        $("img").each(function (idx, img) {
            $("<img>").on("load", imageLoaded).attr("src", $(img).attr("src"))
        });
        var totalImages = $(".question-text img").length;
        var imagesLoaded = 0;
        function imageLoaded() {
            imagesLoaded++
            if (imagesLoaded == totalImages) {
                allImagesLoaded();
            }
        }

        function allImagesLoaded() {
            setTimeout(function() {
                $("#page-load-screen").css("display", "none");
                $("#tp-area").css("display", "flex");
                $("#center-area").css("display", "none");
                $(".question-text").css("opacity", "1");
                $(".question-text").css("display", "block");
                $("#tp-response-button").css("display", "block");
            }, 500);
            startMEA();
        }
    }
}

function evaluateMEA() {
    locked = true;
	$("#tp-response-button").css("display", "none");
	$("#clock").css("display", "none");
	var src = $(".me-thumbnail").filter(function() {
		return $(this).css("background-color") == "rgb(204, 204, 204)";
	}).attr("src");
	var file = getAnswer(src);
	var time = end - start;

    current_item = parseInt(localStorage.getItem('me-adaptive/currentItem'));
    if (!localStorage.getItem('me-adaptive/solvedArray') || !Array.isArray(JSON.parse(localStorage.getItem('me-adaptive/solvedArray')))) {
        var initialArray = [];
        localStorage.setItem('me-adaptive/solvedArray', JSON.stringify(initialArray));
    }
    if (!localStorage.getItem('me-adaptive/accumulatedWrong')) {
        localStorage.setItem('me-adaptive/accumulatedWrong', 0);
    }
    var solvedArrayString = localStorage.getItem('me-adaptive/solvedArray');

    var solvedArrayString = localStorage.getItem('me-adaptive/solvedArray');
    var solvedArray = solvedArrayString ? JSON.parse(solvedArrayString) : [];
    solvedArray.push(current_item); // Wir fügen die Frage zur Liste der beantworteten Fragen hinzu
    var updateSolvedArrayString = JSON.stringify(solvedArray);
    localStorage.setItem('me-adaptive/solvedArray', updateSolvedArrayString); // Wir speichern die Liste der beantworteten Fragen

    if (!localStorage.getItem('me-adaptive/lastCorrect')) { // Wir prüfen, ob die letzte korrekt beantwortete Frage gespeichert ist
        var last_correct = 0; // Wenn nicht, setzen wir sie auf 0
    }
    else { // Wenn ja, holen wir sie uns
        var last_correct = parseInt(localStorage.getItem('me-adaptive/lastCorrect'));
    }

    if (file.indexOf("correct") != -1) {
        last_correct = current_item; // Wenn ja, setzen wir die letzte korrekt beantwortete Frage auf die aktuelle Frage
        localStorage.setItem("me-adaptive/lastCorrect", last_correct); // Wir speichern die letzte korrekt beantwortete Frage
        next_item = last_correct + 3; // Wir springen 3 Fragen weiter
        while (solvedArray.includes(next_item)) { // Wir prüfen, ob die Frage schon beantwortet wurde
            next_item++; // Falls ja, springen wir eine Frage weiter
        }
        localStorage.setItem("me-adaptive/nextItem", next_item); // Wir speichern die nächste Frage
    }else {
        next_item = current_item - 2;
        if (next_item <1) {
            next_item = 1;
        }

         // Wir setzen die nächste frage auf die letzte korrekt beantwortete Frage + 1
         while (solvedArray.includes(next_item)) { // Wir prüfen, ob die Frage schon beantwortet wurde
            next_item--; // Falls ja, springen wir eine Frage weiter
        }
        if (next_item <1) {
            next_item = 1;
        }
        while (solvedArray.includes(next_item)) {
            next_item++;
        }
        localStorage.setItem("me-adaptive/nextItem", next_item); // Wir speichern die nächste Frage
    }
	if(file.indexOf("correct") != -1) {
		$("#answer"+ questionID +"Answer").attr("value", 1);
		answered_correctly = true;
        localStorage.setItem('me-adaptive/accumulatedWrong', 0);
        console.log(0);
	}else {
		$("#answer"+ questionID +"Answer").attr("value", 0);
		answered_correctly = false;
        //set accumulated wrong to 1 + its current value
        var accumulatedWrong = parseInt(localStorage.getItem('me-adaptive/accumulatedWrong'));
        accumulatedWrong++;
        localStorage.setItem('me-adaptive/accumulatedWrong', accumulatedWrong);
        //check if accumulatedWrong is 3 or more
        console.log(accumulatedWrong);
    }
	$("#answer"+ questionID +"Selection").attr("value", file);
	$("#answer"+ questionID +"Time").attr("value", time);
    $("#answer"+ questionID +"ID").attr("value", current_item);

	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		$("#feedback-button").css("display", "block");
	}else {
		$("#proceed-button").click();
	}

    if (accumulatedWrong >= 3) {
        $("#answer"+ questionID +"Abort").attr("value", 1);
        //clear next item and solvedarray
        localStorage.removeItem('me-adaptive/nextItem');
        localStorage.removeItem('me-adaptive/solvedArray');
        localStorage.removeItem('me-adaptive/accumulatedWrong');
        localStorage.setItem("me-adaptive/louScreen1", 1);      
    }

    if (next_item > 66) { // Wir prüfen, ob die nächste Frage größer als 30 ist
        if (current_item != 66) { // Wir prüfen, ob die aktuelle Frage nicht 30 ist
            next_item = 66; // Wenn dies der Fall ist, setzen wir die nächste Frage auf 30
            localStorage.setItem("me-adaptive/nextItem", next_item); // Wir speichern die nächste Frage
        }
        else {
            //clear next item and solvedarray
            localStorage.removeItem('me-adaptive/nextItem');
            localStorage.removeItem('me-adaptive/solvedArray');
            localStorage.removeItem('me-adaptive/accumulatedWrong');
            localStorage.setItem("me-adaptive/louScreen1", 1);      
        }
    }
}


function getAnswer(src) {
	if(src) {
		var name = src.replace( /^.*?([^\/]+)\..+?$/, '$1' );
		return name;
	}else {
		return "none";
	}
}

function getFileNames(matrix) {
	let file_names = [];
	for (var i = 1; i >= 0; i++) {
		
	}
}

function getFile(url) {
	$.get(url, function( data ) {
		
	});
}