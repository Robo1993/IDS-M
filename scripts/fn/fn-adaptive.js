let evaluation_undergoing = false;

var minutes = 0;
var seconds = 0;
var hundreds = 0;

var pause = true;

var correct_or_wrong;

var time_spent = 0;
var block = "";

var start_pressed = false;
var feedback_given = false;

var skip_active = false;

var world;
var canvass;
var time_touch_start;
var time_touch_end;
var checked = false;
var start_time;
var time_used;
var moves = 0;
var icon_rows = 0;
var row_counter = 0;
var src;
var srcS;
var itemObject;

// Default entity options that will just highlight entities when they overlap
var defaultEntityOptions = {
	solid: true,
	heavy: true,
	draggable: true,
	displayAttrs: {
		fill: "#0000ff"
	}
};
var halfcircleOptions = {
	solid: true,
	heavy: true,
	draggable: true,
	displayAttrs: {
		fill: "#0000ff"
	}
};

var block1EntityOptions = {
	solid: true,
	heavy: true,
	draggable: true,
	displayAttrs: {
		fill: "#ff0000",
		stroke: "#555"
	}
};

var block2EntityOptions = {
	solid: true,
	heavy: true,
	draggable: true,
	displayAttrs: {
		fill: "#0000ff",
		stroke: "#555"
	}
};

var block3EntityOptions = {
	solid: true,
	heavy: true,
	draggable: true,
	displayAttrs: {
		fill: "#00b050",
		stroke: "#555"
	}
};

var IDS2EntityOptions = {
	solid: true,
	heavy: true,
	draggable: true,
	displayAttrs: {
		fill: "#f7d800",
		stroke: "#555"
	}
};

var IDS2EntityOptions2 = {
	solid: true,
	heavy: true,
	draggable: true,
	displayAttrs: {
		fill: "#f7d800"
	}
};

var lineOptions = {
	solid: false,
	heavy: true,
	draggable: false,
	displayAttrs: {
		fill: "#333"
	}
};

test_url_adaptive = "https://raw.githubusercontent.com/adgohar/IDS-M-adaptive/main/";
test_items = [];


function initFNA() {
	if(!(questionCode.indexOf("FND") != -1 || questionCode.indexOf("FNV") != -1)) {
		$("#clock").css("display", "block");
	}
	url_items = test_url_adaptive + "fn.csv";
	initializeFNCore();
	setupCanvasA();
	loadLogicTree();
	$("#canvas-container").on("click", function(e) {
		var rect = canvass.canvas.getBoundingClientRect();
		var cursorX = e.clientX - rect.left;
		var cursorY = e.clientY - rect.top;
		var cursor_point = V(cursorX, cursorY);
		if(mode === "rotate-right") {
			rotate_right_entity_onClick(cursor_point, world.entities);
		}else if(mode === "rotate-left") {
			rotate_left_entity_onClick(cursor_point, world.entities);
		}else if(mode === "mirror") {
			mirror_entity_onClick(cursor_point, world.entities);
		}
	});

	$("#canvas-container").on("touchstart", function(e) {
		time_touch_start = new Date
	});

	$("#canvas-container").on("touchend", function(e) {
		time_touch_end = performance.now();
		if(time_touch_end - time_touch_start <= 150) {
			var rect = canvass.canvas.getBoundingClientRect();
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			x = touch.pageX - rect.left;
			y = touch.pageY - rect.top;
			var cursor_point = V(x, y);
			if(mode === "rotate-right") {
					rotate_right_entity_onClick(cursor_point, world.entities);
			}else if(mode === "rotate-left") {
					rotate_left_entity_onClick(cursor_point, world.entities);
			}else if(mode === "mirror") {
					mirror_entity_onClick(cursor_point, world.entities);
			}
		}
	});

	$("#page-load-screen").css("display", "none");

    if (!localStorage.getItem('fn-adaptive/nextItem')) {
        var random_item = Math.floor(Math.random() * 3) + 1;
        var next_item = random_item;
        var current_item = random_item;
        localStorage.setItem('fn-adaptive/currentItem', current_item);
    }
    else {
        var next_item = parseInt(localStorage.getItem('fn-adaptive/nextItem'));
        var current_item = parseInt(localStorage.getItem('fn-adaptive/nextItem'));
        localStorage.setItem('fn-adaptive/currentItem', current_item);
    }

	function loadLogicTree() {
		readItemsCSV(url_items)
        .then(itemDict => {
			test_items = itemDict;
            loadEntitiesA(current_item);
	    })
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
				const itemID = parseInt(values[1])
                const time = parseInt(values[2]);
                const target_img = values[3];
                const triangle_yellow = values[4];
                const triangle_yellow_mirrored = values[5];
                const box_yellow = values[6];
                const triangle_green = values[7];
                const quarter_green = values[8];
                const triangle_red = values[9];
                const box_red = values[10];
				const name = values[11];
                itemDict[itemNumber] = {
					itemID,
                    time,
                    target_img,
                    triangle_yellow,
                    triangle_yellow_mirrored,
                    box_yellow,
                    triangle_green,
                    quarter_green,
                    triangle_red,
                    box_red,
					name
                };
            }
            return itemDict;
        });
    }
}


function startFNA() {
	initFnAdaptiveData();
	if(questionCode.indexOf("UBD") != -1 || questionCode.indexOf("UBV") != -1 || questionCode.indexOf("RD") != -1 || questionCode.indexOf("RV") != -1) {
	}else {
		$("#proceed-button").css("display", "none");
	}
	start = performance.now();
	TimeRestrictionsFNA();
	activateClock();
	setTimeout(function() {
		$("#tp-response-button").css("display", "block");
	}, 2000);
}

function TimeRestrictionsFNA() {
	let current_item = parseInt(localStorage.getItem('fn-adaptive/currentItem'));
    let itemObject = test_items[current_item];
    var time = itemObject.time;
	$(":root").css("--duration", time +"ms");
	setTimeout(function() {
		if(!locked) {
			end = performance.now();
			abort();
		}
	}, time);
}

function feedbackFNA() {
	feedback();
}

function loadEntitiesA(questionNumber) {
	if (localStorage.getItem('fn-adaptive/louScreen1')) {
        const variable_container = document.getElementById("variable-container");
		//get element by classname
		const fn_container = document.getElementsByClassName("fn-container")[0];
		const clock = document.getElementById("clock");

        variable_container.remove();
        fn_container.remove();
		clock.remove();

        //add new img element with 500px width and height
        const img = document.createElement("img");
        const srcS = localStorage.getItem('fn-adaptive/source');
        img.setAttribute("src", srcS + "/4.jpg");
        img.setAttribute("width", "500px");
        img.setAttribute("height", "500px");
		
		$("#proceed-button").css("display", "block");

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

        localStorage.setItem('fn-adaptive/louScreen2', 1);
		localStorage.removeItem('fn-adaptive/louScreen1');
    }
    else if (localStorage.getItem('fn-adaptive/louScreen2')) {
        localStorage.setItem('fn-adaptive/endTest', 1);
        localStorage.removeItem('fn-adaptive/louScreen2');

        const variable_container = document.getElementById("variable-container");
		//get element by classname
		const fn_container = document.getElementsByClassName("fn-container")[0];
		const clock = document.getElementById("clock");

        variable_container.remove();
        fn_container.remove();
		clock.remove();

        // Define srcS or retrieve it from localStorage as needed
        const srcS = localStorage.getItem('fn-adaptive/source');
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

    else if (localStorage.getItem('fn-adaptive/endTest')) {
        localStorage.removeItem('fn-adaptive/endTest');
        const variable_container = document.getElementById("variable-container");
		//get element by classname
		const fn_container = document.getElementsByClassName("fn-container")[0];
		const clock = document.getElementById("clock");

        variable_container.remove();
        fn_container.remove();
		clock.remove();
        progressTest();
    }
    else {

		//Übungsblock 1
		var triangle_red_proto = [V(0, -103.92), V(-90, 51.96), V(90, 51.96)];
		var box_red_proto = [V(-90, -90), V(90, -90), V(90, 90), V(-90, 90)];

		//Übungsblock 2
		// var para_proto_mirrored_blue = [V(-243.63, -63.63), V(116.37, -63.63), V(243.63, 63.63), V(-116.37, 63.63)];
		// var para_proto_blue = [V(-116.37, -63.63), V(243.63, -63.63), V(116.37, 63.63), V(-243.63, 63.63)];
		var para_proto_blue = [V(-26.36, -63.63), V(153.64, -63.63), V(26.36, 63.63), V(-153.64, 63.63)];
		var para_proto_mirrored_blue = [V(-153.64, -63.63), V(26.36, -63.63), V(153.64, 63.63), V(-26.36, 63.63)];

		//Übungsblock 3
		var triangle_green_proto = [V(0, -63.64), V(127.28, 63.64), V(-127.28, 63.64)];

		//Testungsblock
		var triangle_yellow_proto = [V(-90, 51.95), V(-90, -51.95), V(90, 51.95)];
		var triangle_yellow_proto_mirrored = [V(-90, 51.95), V(90, -51.95), V(90, 51.95)];
		var box_yellow_proto = [V(-90,-51.95), V(90,-51.95), V(90,51.95), V(-90,51.95)];

		const itemNumber = parseInt(questionNumber);
		var itemObject = test_items[itemNumber];
		var itemID = itemObject.itemID;
		var target_img = itemObject.target_img;
		var triangle_yellow = itemObject.triangle_yellow;
		var triangle_yellow_mirrored = itemObject.triangle_yellow_mirrored;
		var box_yellow = itemObject.box_yellow;
		var triangle_green = itemObject.triangle_green;
		var quarter_green = itemObject.quarter_green;
		var triangle_red = itemObject.triangle_red;
		var box_red = itemObject.box_red;
		var name = itemObject.name;

		console.log("item rank: " + itemNumber);
		console.log("Item name: " + name);
		
		let thumbnails = [["triangle_yellow", triangle_yellow], ["triangle_yellow_mirrored", triangle_yellow_mirrored], ["box_yellow", box_yellow], ["triangle_green", triangle_green], ["quarter_green", quarter_green], ["triangle_red", triangle_red], ["box_red", box_red]];
		let total_entities = triangle_yellow + triangle_yellow_mirrored + box_yellow + triangle_green + triangle_green + quarter_green + triangle_red + box_red;
		let entities_left = total_entities;
		rowCounterA(total_entities);
		let src = $(".fnImg").attr("src").split("/");
		src.splice(src.length - 2, 2);
		let srcS = src.join("/");
		localStorage.setItem('fn-adaptive/source', srcS);

		$(".fnImg").attr("src", srcS + "/fn"+ itemID + "/" + target_img);

		for (var i = thumbnails.length - 1; i >= 0; i--) {
			let name = thumbnails[i][0];
			let amount = thumbnails[i][1];


			//let position = V(500, 500);
			while(amount > 0) {
				let position = getEntityPosition(total_entities, entities_left);
				if(name == "triangle_yellow") {
					var triangle = world.addEntity(P(position, triangle_yellow_proto), IDS2EntityOptions);
				}else if(name == "triangle_yellow_mirrored") {
					var triangle = world.addEntity(P(position, triangle_yellow_proto_mirrored), IDS2EntityOptions);
				}else if(name == "box_yellow") {
					var box = world.addEntity(P(position, box_yellow_proto), IDS2EntityOptions);
				}else if(name == "triangle_green") {
					var triangle = world.addEntity(P(position, triangle_green_proto), block3EntityOptions);
				}else if(name == "circle_green") {
					var circle = world.addEntity(C(position, 90), block3EntityOptions);
				}else if(name == "quarter_green") {
					var quarter = world.addEntity(Q(position, 90), block3EntityOptions);
				}else if(name == "halfcircle_blue") {
					var halfcircle = world.addEntity(H(position, 90), block2EntityOptions);
				}else if(name == "para_blue") {
					var poly = world.addEntity(P(position, para_proto_blue), block2EntityOptions);
				}else if(name == "para_blue_mirrored") {
					var poly = world.addEntity(P(position, para_proto_blue), block2EntityOptions);
				}else if(name == "triangle_red") {
					var triangle = world.addEntity(P(position, triangle_red_proto), block1EntityOptions);
				}else if(name == "box_red") {
					var box = world.addEntity(P(position, box_red_proto), block1EntityOptions);
				}
				amount--;
				entities_left--;
			}
		}
		$("#play-button").click();	
	}
}

function checkForEntitiesOnStartup() {
	let number = parseInt(questionCode.slice(-2));
	var triangle_red_proto = [V(0, -103.92), V(-90, 51.96), V(90, 51.96)];
	var box_red_proto = [V(-90, -90), V(90, -90), V(90, 90), V(-90, 90)];
	if(questionCode.indexOf("FND") != -1 || questionCode.indexOf("FNV") != -1) {
		if(number == 1) {
			world.addEntity(P(V(150, 360), box_red_proto), block1EntityOptions);
			world.addEntity(P(V(450, 360), box_red_proto), block1EntityOptions);
			world.addEntity(P(V(750, 360), triangle_red_proto), block1EntityOptions);
		}else if(number == 2) {
			world.addEntity(P(V(150, 360), triangle_red_proto), block1EntityOptions);
		}else if(number == 3) {
			world.addEntity(P(V(450, 360), box_red_proto), block1EntityOptions);
		}else if(number == 4) {
			world.addEntity(P(V(450, 360), box_red_proto), block1EntityOptions);
		}
		$("#proceed-button").css("display", "block");
	}
}

function abort() {
	//end = new Date();
	if(!evaluation_undergoing) {
		locked = true;
		$("#fn-thumbnails").css("display", "none");
		evaluateFNA();
	}
}

function evaluateFNA() {
	end = performance.now();
	evaluation_undergoing = true;
	let time = end - start;
	let current_item = parseInt(localStorage.getItem('fn-adaptive/currentItem'));
    let itemObject = test_items[current_item];
	let current_name = itemObject.name;
	if (itemObject.name == "R10") {
		let eval_points = getElementByName("R10_1");
		var correct = evaluateCalcPoints(world.entities, eval_points);
		if (!correct) {
			eval_points = getElementByName("R10_2");
			correct = evaluateCalcPoints(world.entities, eval_points);
		}
	}
	//do the same for R11 and R14
	else if (itemObject.name == "R11") {
		let eval_points = getElementByName("R11_1");
		var correct = evaluateCalcPoints(world.entities, eval_points);
		if (!correct) {
			eval_points = getElementByName("R11_2");
			correct = evaluateCalcPoints(world.entities, eval_points);
		}
	}
	else if (itemObject.name == "R14") {
		let eval_points = getElementByName("R14_1");
		var correct = evaluateCalcPoints(world.entities, eval_points);
		if (!correct) {
			eval_points = getElementByName("R14_2");
			correct = evaluateCalcPoints(world.entities, eval_points);
		}
	}
	//all existing evaluation point lists are contained in data.js in the same folder
	else {
		let eval_points = getElementByName(itemObject.name);
		var correct = evaluateCalcPoints(world.entities, eval_points);
	}
		console.log(correct);

	if (!localStorage.getItem('fn-adaptive/solvedArray') || !Array.isArray(JSON.parse(localStorage.getItem('fn-adaptive/solvedArray')))) {
        var initialArray = [];
        localStorage.setItem('fn-adaptive/solvedArray', JSON.stringify(initialArray));
    }
    var solvedArrayString = localStorage.getItem('fn-adaptive/solvedArray');

    var solvedArrayString = localStorage.getItem('fn-adaptive/solvedArray');
    var solvedArray = solvedArrayString ? JSON.parse(solvedArrayString) : [];
    solvedArray.push(current_item); // Wir fügen die Frage zur Liste der beantworteten Fragen hinzu
    var updateSolvedArrayString = JSON.stringify(solvedArray);
    localStorage.setItem('fn-adaptive/solvedArray', updateSolvedArrayString); // Wir speichern die Liste der beantworteten Fragen

    if (!localStorage.getItem('fn-adaptive/lastCorrect')) { // Wir prüfen, ob die letzte korrekt beantwortete Frage gespeichert ist
        var last_correct = 0; // Wenn nicht, setzen wir sie auf 0
    }
    else { // Wenn ja, holen wir sie uns
        var last_correct = parseInt(localStorage.getItem('fn-adaptive/lastCorrect'));
    }

    if (correct) {
        last_correct = current_item; // Wenn ja, setzen wir die letzte korrekt beantwortete Frage auf die aktuelle Frage
        localStorage.setItem("fn-adaptive/lastCorrect", last_correct); // Wir speichern die letzte korrekt beantwortete Frage
        next_item = last_correct + 3; // Wir springen 3 Fragen weiter
        while (solvedArray.includes(next_item)) { // Wir prüfen, ob die Frage schon beantwortet wurde
            next_item++; // Falls ja, springen wir eine Frage weiter
        }
        localStorage.setItem("fn-adaptive/nextItem", next_item); // Wir speichern die nächste Frage
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
        localStorage.setItem("fn-adaptive/nextItem", next_item); // Wir speichern die nächste Frage
    }
	if(correct) {
		if (!localStorage.getItem('fn-adaptive/lastFiveArray')) {
			var lastFiveArray = [1,1,1,1,1];
		} else {
			var lastFiveArray = JSON.parse(localStorage.getItem('fn-adaptive/lastFiveArray'));
		}

		lastFiveArray.push(1);
		if (lastFiveArray.length > 5) {
			lastFiveArray.shift();
		}
		console.log(lastFiveArray);
		localStorage.setItem('fn-adaptive/lastFiveArray', JSON.stringify(lastFiveArray));
		answered_correctly = true;
	}else {
		if (!localStorage.getItem('fn-adaptive/lastFiveArray')) {
			var lastFiveArray = [1,1,1,1,1];
		} else {
			var lastFiveArray = JSON.parse(localStorage.getItem('fn-adaptive/lastFiveArray'));
		}

		lastFiveArray.push(0);
		if (lastFiveArray.length > 5) {
			lastFiveArray.shift();
		}
		console.log(lastFiveArray);
		localStorage.setItem('fn-adaptive/lastFiveArray', JSON.stringify(lastFiveArray));
		answered_correctly = false;
    }
	$("#answer"+ questionID +"NextRow").attr("value", 0);
	$("#answer"+ questionID +"Abort").attr("value", 0);
	$("#answer"+ questionID +"Shape").attr("value", correct);
	$("#answer"+ questionID +"Angle").attr("value", angle_of_shape);
	$("#answer"+ questionID +"Time").attr("value", time);
	$("#answer"+ questionID +"Moves").attr("value", moves);
	$("#answer"+ questionID +"Centroid").attr("value", Math.round(centroid.x * 100) / 100 + ";" + Math.round(centroid.y * 100) / 100);
	$("#answer"+ questionID +"ID").attr("value", itemObject.itemID);
	$("#answer"+ questionID +"Rank").attr("value", current_item);
	$("#answer"+ questionID +"Name").attr("value", itemObject.name);
	// if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
	// 	$("#feedback-button").css("display", "block");
	// }else {
	// 	$("#proceed-button").css("display", "block");
	// }
	if (questionCode.indexOf("FNAD") != -1 || questionCode.indexOf("FNAV") != -1) {
		feedbackFN();
	}
	else {
		$("#proceed-button").click();
	}

	let accumulatedWrong = 0;
	//if lastfivearray has more than 3 0s, set abort to 1
	lastFiveArray = JSON.parse(localStorage.getItem('fn-adaptive/lastFiveArray'));
	for (var j = 0; j < lastFiveArray.length; j++) {
		if (lastFiveArray[j] == 0) {
			accumulatedWrong++;
		}
	}

	if (accumulatedWrong >= 3) {
        $("#answer"+ questionID +"Abort").attr("value", 1);
        //clear next item and solvedarray
        localStorage.removeItem('fn-adaptive/solvedArray');
        localStorage.removeItem('fn-adaptive/lastFiveArray');
        localStorage.setItem("fn-adaptive/louScreen1", 1);
		localStorage.setItem("idsm/fn", "true");    
    }

    if (next_item > 41) { // Wir prüfen, ob die nächste Frage größer als 30 ist
        if (current_item != 41 && ! solvedArray.includes(41)) {
            next_item = 41; // Wenn dies der Fall ist, setzen wir die nächste Frage auf 30
            localStorage.setItem("fn-adaptive/nextItem", next_item); // Wir speichern die nächste Frage
        }
        else {
            //clear next item and solvedarray
			localStorage.removeItem('fn-adaptive/solvedArray');
            localStorage.setItem("fn-adaptive/louScreen1", 1);
			localStorage.removeItem('fn-adaptive/lastFiveArray');
			localStorage.setItem("idsm/fn", "true");
        }
    }
}

function setupCanvasA() {
	// Simple onCollide handler that changes colors of displayed items.
	function displayCollision(other, response) {
		this.displayAttrs.fill = response.aInB ? '#0F0' : '#F00';
		other.displayAttrs.fill = response.bInA ? '#0F0' : '#F00';
	}
	// onTick handler that restores "non collided" color
	function restoreNoCollisionColors() {
		this.displayAttrs.fill = '#CCC';
	}

	(function () {

		canvass = Raphael('fn-canvas-container', 900, 720);
		$("svg").css("z-index", "5");
		world = new World(canvass);

	}());
}

function getEntityPosition(total_icons, icons_left) {
	var min_height = 180;
	var min_width = 180;
	var position = V(0, 0);

	position.y = 90 + (min_height*(total_icons - icons_left));

	if(position.y > 720) {
		let offset = Math.abs(720 - position.y);
		row_counter = 2;
		if(position.y > 1440) {
			offset = Math.abs(1440 - position.y);
			row_counter = 3;
		}
		position.y = offset
	}
	position.x = 90 + (row_counter * min_width);
	return position;
}

function iconsCounter() {
	var total_icons = $(".pre-img").length;
	var hidden_icons = $(".pre-img[style*='display: none']").length;
	return total_icons - hidden_icons;
}

function rowCounterA(icons) {
	if(icons <= 4) {
		icon_rows = 1;
	}else if(icons <= 8) {
		icon_rows = 2;
	}else {
		icon_rows = 3;
	}
}

function drawInnerCircle(entity) {
    $("circle").remove();

    const centerX = entity.data.pos.x;
	const centerY = entity.data.pos.y;
	drawCircle(centerX, centerY, "black");
}

function SVG(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

var drawCircle = function(x,y,color) {
        var $svg = $("svg");
        $(SVG('circle'))
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 15)
            .attr('fill', color)
            .appendTo($svg);
};