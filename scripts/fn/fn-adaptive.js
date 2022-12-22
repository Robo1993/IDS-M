
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

function initFNA() {
	if(!(questionCode.indexOf("FND") != -1 || questionCode.indexOf("FNV") != -1)) {
		$("#clock").css("display", "block");
	}
	url_tree = url_adaptive + "tree/fn-tree.csv";
	url_items = url_adaptive + "items/fn-items.csv";
	current_row = parseInt($("#current-row").text());
	if(!current_row) {
		current_row = 1;
	}
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

	function loadLogicTree() {
		readItemsCSV(url_items);
	}

	function createTree() {
		logic_tree = new LogicTree(tree, items, "FN");
		loadEntitiesA();
	}

	function readLogicTreeCSV(csv) {
		$.get(csv, function( data ) {
			//this.tree = Papa.parse(data);
			tree = Papa.parse(data);
			createTree();
		});
	}

	function readItemsCSV(csv, readCSV) {
		$.get(csv, function( data ) {
			//this.items = Papa.parse(data);
			items = Papa.parse(data);
			readLogicTreeCSV(url_tree);
		});
	}
}

function startFNA() {
	if(questionCode.indexOf("UBD") != -1 || questionCode.indexOf("UBV") != -1 || questionCode.indexOf("RD") != -1 || questionCode.indexOf("RV") != -1) {
		$(":root").css("--duration", "180s");
	}else {
		$("#proceed-button").css("display", "block");
	}
	start = performance.now();
	TimeRestrictionsFNA();
	activateClock();
	setTimeout(function() {
		$("#tp-response-button").css("display", "block");
	}, 2000);
}

function loadEntitiesA() {

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

	let item = logic_tree.getItemByRow(current_row);
	let triangle_yellow = item.triangle_yellow;
	let triangle_yellow_mirrored = item.triangle_yellow_mirrored;
	let box_yellow = item.box_yellow;
	let triangle_green = item.triangle_green;
	let quarter_green = item.quarter_green;
	let triangle_red = item.triangle_red;
	let box_red = item.box_red;
	let thumbnails = [["triangle_yellow", triangle_yellow], ["triangle_yellow_mirrored", triangle_yellow_mirrored], ["box_yellow", box_yellow], ["triangle_green", triangle_green], ["quarter_green", quarter_green], ["triangle_red", triangle_red], ["box_red", box_red]];
	let total_entities = triangle_yellow + triangle_yellow_mirrored + box_yellow + triangle_green + triangle_green + quarter_green + triangle_red + box_red;
	let entities_left = total_entities;
	rowCounterA(total_entities);
	let src = $(".fnImg").attr("src").split("/");
	src.splice(src.length - 2, 2);
	let srcS = src.join("/");

	$(".fnImg").attr("src", srcS + "/fn"+ item.item + "/" + item.target);

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

	$("#play-button").css("display", "block");
}

function TimeRestrictionsFNA() {
	let item = logic_tree.getItemByRow(current_row);
	$(":root").css("--duration", item.time_barrier +"ms");
	setTimeout(abort, item.time_barrier);
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
	locked = true;
	$("#tp-response-button").css("display", "none");
	$("#fn-thumbnails").css("display", "none");
	evaluateFNA();
}

function evaluateFNA() {
	end = performance.now();
	let time = end - start;

	let eval_points = routing_block[logic_tree.getItemByRow(current_row).item];
	var correct = evaluateCalcPoints(world.entities, eval_points);

	let item = logic_tree.getItemByRow(current_row);
	let rows = logic_tree.getRowsByItem(item.item);
	let row;
	for (var i = rows.length - 1; i >= 0; i--) {
		r = rows[i];
		if (correct && r.score == 1) {
			row = r;
		}else if(!correct && r.score == 0) {
			row = r;
		}
	}
	$("#answer"+ questionID +"Shape").attr("value", correct);
	$("#answer"+ questionID +"Angle").attr("value", angle_of_shape);
	$("#answer"+ questionID +"Time").attr("value", time);
	$("#answer"+ questionID +"Moves").attr("value", moves);
	$("#answer"+ questionID +"Centroid").attr("value", Math.round(centroid.x * 100) / 100 + ";" + Math.round(centroid.y * 100) / 100);
	$("#answer"+ questionID +"NextRow").attr("value", row.next_row);
	$("#answer"+ questionID +"Abort").attr("value", row.abort);
	
	// if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
	// 	$("#feedback-button").css("display", "block");
	// }else {
	// 	$("#proceed-button").css("display", "block");
	// }
	feedbackFN();
	$("#proceed-button").css("display", "block");
}

function feedbackFNA() {
	feedback();
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