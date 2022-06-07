	let ctx;
	let ctx_old;
	let canvas;
	let canvas_old;

	let mode;
	let crossing = 0;
	let percentage = 0;
	let crossed_fields = 0;
	let missed_fields = 0;
	let pickups = 0;
	let date_of_last_pickup;
	let target = false;
	let starting_area = [];
	//var locked = true;

	let is_white = false;
	let was_white = false;
	let was_red = false;
	let was_black = false;

	let img = new Image();
	let evalImg = new Image();
	let imgd;

	let last_position_x = 99999;
	let last_position_y = 99999;

	let lastmove;
	let firstmove = true;

	let corr = 0;

 function init() {

		if(questionCode.indexOf("I") == -1 && questionCode.indexOf("Q") == -1) {

			img.src = $("#ezle-img").attr("src");
			evalImg.src = $("#eval-img").attr("src");

			$("#canvas-container").append("<canvas id='draw' style='border:1px solid #ccc;'></canvas>");
			$("#canvas-container").append("<canvas id='backup' style='border:1px solid #ccc; display:none;'></canvas>");

			if(questionCode.indexOf("FA") != -1 || questionCode.indexOf("FS") != -1) {
				mode = 0;

				if(questionCode.indexOf("FA") != -1) {
					$("#draw").addClass("draw-fa");
				}else if(questionCode.indexOf("FS") != -1) {
					$("#draw").addClass("draw-fs");
				}

			}else if(questionCode.indexOf("EZLE") != -1) {
				mode = 1;
			}
			canvas = document.querySelector('#draw');
			// could be 3d, if you want to make a video game
			ctx = canvas.getContext('2d');
			
			if(questionCode.indexOf("EZLE06T2") != -1 || questionCode.indexOf("QEZLE") != -1) {
				canvas.width = mode === 0 ? 750:1050;
				canvas.height = mode === 0 ? 500:700;
			}else {
				canvas.width = mode === 0 ? 500:700;
				canvas.height = mode === 0 ? 500:700;
			}
			
			if(questionCode.indexOf("EZLE") != -1) {
				loadAndDrawImage(canvas, ctx, img);
			}

			canvas_old = document.querySelector('#backup');
			ctx_old = canvas_old.getContext('2d');
			canvas_old.width = mode === 0 ? 500:700;
			canvas_old.height = mode === 0 ? 500:700;
			loadAndDrawImage(canvas_old, ctx_old, evalImg);
			
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			ctx.lineWidth = 4;
			ctx.strokeStyle = '#ac0000';

			var isDrawing = false;
			var lastX = 0;
			var lastY = 0;

			$("#clear-canvas").on("click", function() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			});

			$("#canvas-proceed").on("click", function() {
				moveNext();
			});

			function draw(e) {
				// stop the function if they are not mouse down
				if(!isDrawing || locked) return;
				//listen for mouse move event
				collision(ctx, e.offsetX, e.offsetY);
				if(!firstmove && !checkDrawingBoundaries(e.offsetX, e.offsetY)) {
					console.log(e);
					ctx.beginPath();
					ctx.moveTo(lastX, lastY);
					ctx.lineTo(e.offsetX, e.offsetY);
					ctx.stroke();
					[lastX, lastY] = [e.offsetX, e.offsetY];
					updateCounter();
					if(!option_selected) {
						option_selected = true
					}
					last_position_x = e.offsetX;
					last_position_y = e.offsetY;
				}else {
					canvas.mouseup();
				}
			}

			function drawTouch(e) {
				// stop the function if they are not mouse down
				lastmove = e;
				var rect = e.target.getBoundingClientRect();
				if(!isDrawing || locked) return;
				//listen for mouse move event
				var rect = e.target.getBoundingClientRect();
				var x = e.targetTouches[0].pageX - rect.left;
				var y = e.targetTouches[0].pageY - rect.top;
				//[lastX, lastY] = [e.touches[0].pageX, e.touches[0].pageY];
				collision(ctx, x, y);
				if(!firstmove && !checkDrawingBoundaries(e.targetTouches[0].pageX - rect.left, e.targetTouches[0].pageY - rect.top)) {
					console.log(e);
					ctx.beginPath();
					ctx.moveTo(lastX, lastY);
					ctx.lineTo(x, y);
					ctx.stroke();
					[lastX, lastY] = [x, y];
					updateCounter();
					if(!option_selected) {
						option_selected = true
					}
					last_position_x = lastmove.targetTouches[0].pageX - rect.left;
					last_position_y = lastmove.targetTouches[0].pageY - rect.top;
				}else{
					canvas.preventDefault();
				}
			}

			canvas.addEventListener('mousedown', (e) => {
				var x = e.offsetX;
				var y = e.offsetY;
				if(firstmove) {
					last_position_x = e.offsetX;
					last_position_y = e.offsetY;
					if(questionCode.indexOf("EZLE") != -1) {
						if(isInStartingArea(x, y)) {
							isDrawing = true;
							firstmove = false;
							start = performance.now();
						}
					}else if(questionCode.indexOf("FA") != -1 || questionCode.indexOf("FS") != -1) {
						isDrawing = true;
						firstmove = false;
						start = performance.now();
					}
				}else {
					if(((last_position_x <= x + 10 && last_position_x >= x - 10) && (last_position_y <= y + 10 && last_position_y >= y - 10)) || questionCode.indexOf("EZLE") == -1) {
						isDrawing = true;
					}
				}
				[lastX, lastY] = [e.offsetX, e.offsetY];
			});

			canvas.addEventListener('touchstart', (e) => {
				var rect = e.target.getBoundingClientRect();
				var x = e.targetTouches[0].pageX - rect.left;
				var y = e.targetTouches[0].pageY - rect.top;

				if(firstmove) {
					var rect = e.target.getBoundingClientRect();
					last_position_x = e.targetTouches[0].pageX - rect.left;
					last_position_y = e.targetTouches[0].pageY - rect.top;
					if(questionCode.indexOf("EZLE") != -1) {
						if(isInStartingArea(x, y)) {
							isDrawing = true;
							firstmove = false;
							start = performance.now();
						}
					}else {
						isDrawing = true;
						firstmove = false;
						start = performance.now();
					}
				}else {
					if(((last_position_x <= x + 10 && last_position_x >= x - 10) && (last_position_y <= y + 10 && last_position_y >= y - 10)) || questionCode.indexOf("EZLE") == -1) {
						isDrawing = true;
						firstmove = false;
					}
				}
				//[lastX, lastY] = [e.touches[0].pageX, e.touches[0].pageY];
				[lastX, lastY] = [x, y];
			});

			canvas.addEventListener('mousemove', draw);
			canvas.addEventListener('mouseup', (e) => {
				if(isDrawing) {
					pickups++;
					date_of_last_pickup = performance.now();
					isDrawing = false;
					var rect = e.target.getBoundingClientRect();
				}
			});
			canvas.addEventListener('mouseout', () => isDrawing = false);

			canvas.addEventListener('touchmove', (e) => {
				var rect = e.target.getBoundingClientRect();
				if(!checkDrawingBoundaries(e.targetTouches[0].pageX - rect.left, e.targetTouches[0].pageY - rect.top)) {
					drawTouch(e);
				}else {
					e.preventDefault();
				}
			});
			canvas.addEventListener('touchend', (e) => {
				if(isDrawing) {
					pickups++;
					date_of_last_pickup = performance.now();
					isDrawing = false;
				}
			});
			canvas.addEventListener('touchcancel', () => isDrawing = false);
		}
}

function checkDrawingBoundaries(x, y) {
	let out_of_bound = false;
	if(x > parseInt($("#draw").width()) || x < 0 || y > parseInt($("#draw").height()) || y < 0) {
		out_of_bound = true;
	}
	return out_of_bound;
}

function loadAndDrawImage(canvas, ctx, img)
{
    // Create an image object. This is not attached to the DOM and is not part of the page.
    var image = new Image();

    // When the image has loaded, draw it to the canvas
    image.onload = function()
    {
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
        if(questionCode.indexOf("R") != -1) {
			rotateCanvas(2, canvas, ctx, img);
		}else if(questionCode.indexOf("O") != -1) {
			rotateCanvas(1, canvas, ctx, img);
		}else if(questionCode.indexOf("U") != -1) {
			rotateCanvas(3, canvas, ctx, img);
		}
    }

    // Now set the source of the image that we want to load
    image.src = img.src;
}


function collision(ctx, x, y) {
		if(questionCode.indexOf("EZLE") != -1) {
			imgd = ctx_old.getImageData(x-2, y-2, 4, 4);
			var pix = imgd.data;

			var out_of_bound_pixels = 0;
			var red_pixels = 0;
			var blue_pixels = 0;
			var grey_pixels = 0;
			var non_white = 0;
			var starting_color = 0;

			for (var i = 0; n = pix.length, i < n; i += 4) {
				var r = pix[i];
				var g = pix[i+1];
				var b = pix[i+2];
				var a = pix[i+3];

				if (r == 0 && g == 0 && b == 0 && a == 0) {
					out_of_bound_pixels++;
				}else if(r == 204 && g == 204 && b == 204 && a == 255) {
					grey_pixels++;
					non_white++;
				}else if(r == 51 && g == 102 && b == 204 && a == 255) {
					blue_pixels++;
					non_white++;
				}else if(r == 255 && g == 0 && b == 0 && a == 255) {
					starting_color++;
					non_white++;
				}else {
					non_white++;
				}
			}

			if(non_white == 0) {
				if(!was_white) {
					was_white = true;
				}
			}else if(out_of_bound_pixels == 0 && grey_pixels > 0 || blue_pixels > 0) {
				if (was_white) {
					was_white = false;
					crossing++;
				}
			}
			if(blue_pixels > 0) {
				//Lock();
				//blue target reached, mark it in LimeSurvey answers
				target = true;
				//stopClock();
			}
		}
}

function checkPercentage() {
	var bc_img = ctx_old.getImageData(0, 0, 700, 700);
	var draw_img = ctx.getImageData(0, 0, 700, 700);

	var pix_bc = bc_img.data;
	var pix_draw = draw_img.data;

	var pixel_not_in_shape = 0;
	var pixel_in_shape = 0;

	for (var i = 0; n = pix_bc.length, i < n; i += 4) {
		var r_bc = pix_bc[i];
		var g_bc = pix_bc[i+1];
		var b_bc = pix_bc[i+2];
		var a_bc = pix_bc[i+3];

		var r_draw = pix_draw[i];
		var g_draw = pix_draw[i+1];
		var b_draw = pix_draw[i+2];
		var a_draw = pix_draw[i+3];

		if(r_draw >= 171 && r_draw <= 172 && g_draw >= 0 && b_draw == 0 && a_draw == 255) {
			if(r_bc == 0 && g_bc == 0 && b_bc == 0 && a_bc == 0) {
				pixel_not_in_shape++;
			}else {
				pixel_in_shape++;
			}
		}
	}
	percentage = Math.floor((pixel_in_shape / (pixel_in_shape + pixel_not_in_shape) * 100) * 100) / 100;
	$("#percentage").text(percentage + "%");
}

function checkFields() {
	let fields = howManyFields();
	let one = false;
	let two = false;
	let three = false;
	let fore = false;
	let five = false;
	let six = false;
	let seven = false;
	let eight = false;
	let nine = false;
	let ten = false;
	let eleven = false;
	let twelve = false;
	crossed_fields = 0;
	var bc_img = ctx_old.getImageData(0, 0, 700, 700);
	var draw_img = ctx.getImageData(0, 0, 700, 700);

	var pix_bc = bc_img.data;
	var pix_draw = draw_img.data;

	var pixel_not_in_shape = 0;
	var pixel_in_shape = 0;

	for (var i = 0; n = pix_bc.length, i < n; i += 4) {
		var r_bc = pix_bc[i];
		var g_bc = pix_bc[i+1];
		var b_bc = pix_bc[i+2];
		var a_bc = pix_bc[i+3];

		var r_draw = pix_draw[i];
		var g_draw = pix_draw[i+1];
		var b_draw = pix_draw[i+2];
		var a_draw = pix_draw[i+3];

		if(r_draw >= 171 && r_draw <= 172 && g_draw >= 0 && b_draw == 0 && a_draw == 255) {
			if(r_bc == 0 && g_bc == 0 && b_bc == 0 && a_bc == 0) {
				pixel_not_in_shape++;
			}else {
				pixel_in_shape++;
			}

			if(r_bc == 255 && g_bc == 0 && b_bc == 0 && a_bc == 255 && one == false) {
				crossed_fields++;
				one = true;
			}else if(r_bc == 254 && g_bc == 0 && b_bc == 0 && a_bc == 255 && two == false) {
				crossed_fields++;
				two = true;
			}else if(r_bc == 253 && g_bc == 0 && b_bc == 0 && a_bc == 255 && three == false) {
				crossed_fields++;
				three = true;
			}else if(r_bc == 252 && g_bc == 0 && b_bc == 0 && a_bc == 255 && fore == false) {
				crossed_fields++;
				fore = true;
			}else if(r_bc == 251 && g_bc == 0 && b_bc == 0 && a_bc == 255 && five == false) {
				crossed_fields++;
				five = true;
			}else if(r_bc == 250 && g_bc == 0 && b_bc == 0 && a_bc == 255 && six == false) {
				crossed_fields++;
				six = true;
			}else if(r_bc == 249 && g_bc == 0 && b_bc == 0 && a_bc == 255 && seven == false) {
				crossed_fields++;
				seven = true;
			}else if(r_bc == 248 && g_bc == 0 && b_bc == 0 && a_bc == 255 && eight == false) {
				crossed_fields++;
				eight = true;
			}else if(r_bc == 247 && g_bc == 0 && b_bc == 0 && a_bc == 255 && nine == false) {
				crossed_fields++;
				nine = true;
			}else if(r_bc == 246 && g_bc == 0 && b_bc == 0 && a_bc == 255 && ten == false) {
				crossed_fields++;
				ten = true;
			}else if(r_bc == 245 && g_bc == 0 && b_bc == 0 && a_bc == 255 && eleven == false) {
				crossed_fields++;
				eleven = true;
			}else if(r_bc == 244 && g_bc == 0 && b_bc == 0 && a_bc == 255 && twelve == false) {
				crossed_fields++;
				twelve = true;
			}
		}
	}
	missed_fields = fields - crossed_fields;
}

function howManyFields() {
	let fields = 0;
	let one = false;
	let two = false;
	let three = false;
	let fore = false;
	let five = false;
	let six = false;
	let seven = false;
	let eight = false;
	let nine = false;
	let ten = false;
	let eleven = false;
	let twelve = false;
	let fields_counter = 12;
	var bc_img = ctx_old.getImageData(0, 0, 700, 700);

	var pix_bc = bc_img.data;

	for (var i = 0; n = pix_bc.length, i < n; i += 4) {
		var r_bc = pix_bc[i];
		var g_bc = pix_bc[i+1];
		var b_bc = pix_bc[i+2];
		var a_bc = pix_bc[i+3];

		if(r_bc == 255 && g_bc == 0 && b_bc == 0 && a_bc == 255 && one == false) {
			fields++;
			one = true;
		}else if(r_bc == 254 && g_bc == 0 && b_bc == 0 && a_bc == 255 && two == false) {
			fields++;
			two = true;
		}else if(r_bc == 253 && g_bc == 0 && b_bc == 0 && a_bc == 255 && three == false) {
			fields++;
			three = true;
		}else if(r_bc == 252 && g_bc == 0 && b_bc == 0 && a_bc == 255 && fore == false) {
			fields++;
			fore = true;
		}else if(r_bc == 251 && g_bc == 0 && b_bc == 0 && a_bc == 255 && five == false) {
			fields++;
			five = true;
		}else if(r_bc == 250 && g_bc == 0 && b_bc == 0 && a_bc == 255 && six == false) {
			fields++;
			six = true;
		}else if(r_bc == 249 && g_bc == 0 && b_bc == 0 && a_bc == 255 && seven == false) {
			fields++;
			seven = true;
		}else if(r_bc == 248 && g_bc == 0 && b_bc == 0 && a_bc == 255 && eight == false) {
			fields++;
			eight = true;
		}else if(r_bc == 247 && g_bc == 0 && b_bc == 0 && a_bc == 255 && nine == false) {
			fields++;
			nine = true;
		}else if(r_bc == 246 && g_bc == 0 && b_bc == 0 && a_bc == 255 && ten == false) {
			fields++;
			ten = true;
		}else if(r_bc == 245 && g_bc == 0 && b_bc == 0 && a_bc == 255 && eleven == false) {
			fields++;
			eleven = true;
		}else if(r_bc == 244 && g_bc == 0 && b_bc == 0 && a_bc == 255 && twelve == false) {
			fields++;
			twelve = true;
		}
	}
	return fields;
}

function updateCounter() {
	$("#counter").text(crossing);
}

function Lock() {
	end = new Date();
	stopClock();
	locked = true;
	localStorage.setItem(questionCode + "Eval", canvas.toDataURL("image/png"));
	checkPercentage();
}

function Unlock() {
	locked = false;
}

function drawImage() {
	//locked = false;
	if(questionCode.indexOf("QEZLE") != -1) {
		ctx.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
						175, 0, 700, 700);         // destination rectangle
	}else {
		ctx.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
						0, 0, canvas.width, canvas.height);         // destination rectangle    
	}

}

function getStartingArea() {
	// on first touch, check if cursor-position is in starting-area
}

function rotateCanvas(counter, canvas, ctx, img) {
		ctx.save(); 
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.translate(canvas.width/2,canvas.height/2);
		ctx.rotate(counter*90*Math.PI/180);
		ctx.translate(-canvas.width/2,-canvas.height/2);
		ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
		ctx.restore();
}

function getCrossings() {
	return crossing;
}

function getWasWhite() {
	return was_white;
}

function isInStartingArea(x, y) {
	var color_code = getColorAtCoordinate(x, y)
	var r = color_code[0];
	var g = color_code[1];
	var b = color_code[2];
	var a = color_code[3];

	if(r == 255 && g == 0 && b == 0 && a == 255) {
		return true;
	}else {
		return false;
	}
}

//params:
//@x, y = coordinate of the cursor
function getColorAtCoordinate(x, y) {
	var color_code;
	color_code = ctx_old.getImageData(x, y, 1, 1).data;
	return color_code;
}

function corrImg(array1, array2) {
	return true;
}