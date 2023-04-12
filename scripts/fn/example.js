var draggedEntity;
var time_mouse_down;
var time_mouse_up;
var drag_rotation;
var rotation_point;
var old_cursor;
var original_angle;
var total_angle;
var previous_angle;
var invert;
var moved;
var all_moved;
var variation_counter = 0;
var centroid;
var correctly_rotated = false;
var angle_of_shape = 0;

var log_overlap;

var log_total;
var log_a;
var log_c;
var log_oc;
var log_d;
var log_e;

var V;
var P;
var B;
var H;
var C;

let drag_mode;

function initializeFNCore() {
  // Alias a few things in SAT.js to make the code shorter
  V = function (x, y) { return new SAT.Vector(x, y); };
  P = function (pos, points) { return new SAT.Polygon(pos, points); };
  CC = function (pos, r) { return new SAT.Circle(pos, r); };
  B = function (pos, w, h) { return new SAT.Box(pos, w, h); };
  H = function (pos, r) { 
      var points = [];
      for(var d = 0; d <= 180; d = d + 5) {
        var point_on_halfcircle = V(r * Math.cos(d * Math.PI / 180), r * Math.sin(d * Math.PI / 180));
        points.push(point_on_halfcircle);
      }
    return new SAT.Polygon(pos, points); 
  };

  C = function (pos, r) { 
      var points = [];
      for(var d = 0; d <= 360; d = d + 5) {
        var point_on_circle = V(r * Math.cos(d * Math.PI / 180), r * Math.sin(d * Math.PI / 180));
        points.push(point_on_circle);
      }
    return new SAT.Polygon(pos, points); 
  };

  Q = function (pos, r) { 
      var points = [];
      points.push(V(0, 0));
      for(var d = 0; d <= 90; d = d + 5) {
        var point_on_circle = V(r * Math.cos(d * Math.PI / 180), r * Math.sin(d * Math.PI / 180));
        points.push(point_on_circle);
      }
    return new SAT.Polygon(pos, points); 
  };

  initFnData();

  draggedEntity;
  time_mouse_down;
  time_mouse_up;
  drag_rotation = false;
  rotation_point = V(0, 0);
  old_cursor = V(0, 0);
  original_angle = 0;
  total_angle = 0;
  previous_angle = 0;
  invert = false;
  moved = [];
  all_moved = false;

  log_overlap = [];

  log_total = [];
  log_a = [];
  log_c = [];
  log_oc = [];
  log_d = [];
  log_e = [];
}

function Lock() {
  locked = true;
}

function Unlock() {
  locked = false;
}

function rotate_right_entity_onClick(cursor_point, entities) {
  if(!locked) {
    Object.keys(entities).forEach(function(key) {
      var entity = entities[key];
      if(!(entity.data instanceof SAT.Circle)) {
        var angle = entity.data.angle;
        if(SAT.pointInPolygon(cursor_point, entity.data)) {
          if(time_mouse_up - time_mouse_down <= 150) {
            if(angle + 0.2617899999 >= 6.28319) {
              entity.data.setAngle(0);
            }else {
              entity.data.setAngle(angle + 0.2617899999);
            }
            entity.updateDisplay();
          }
        }
      }
    });
  }
}

function rotate_left_entity_onClick(cursor_point, entities) {
  if(!locked) {
    Object.keys(entities).forEach(function(key) {
      var entity = entities[key];
      if(!(entity.data instanceof SAT.Circle)) {
        var angle = entity.data.angle;
        if(SAT.pointInPolygon(cursor_point, entity.data)) {
          if(time_mouse_up - time_mouse_down <= 150) {
            if(angle - 0.2617899999 <= -6.28319) {
              entity.data.setAngle(0);
            }else {
              entity.data.setAngle(angle - 0.2617899999);
            }
            entity.updateDisplay();
          }
        }
      }
    });
  }
}

function mirror_entity_onClick(cursor_point, entities) {
  if(!locked) {
    Object.keys(entities).forEach(function(key) {
      var entity = entities[key];
      if(!(entity.data instanceof SAT.Circle)) {
        if(SAT.pointInPolygon(cursor_point, entity.data)) {
          if(time_mouse_up - time_mouse_down <= 150) {
            entity.data.mirror();
            entity.updateDisplay();
          }
        }
      }
    });
  }
}

function checkShape(entities, code) {
  if(code.indexOf("2UB06") != -1) {
    TwoUBsix(entities, code);
  }else if(code.indexOf("1UBD01") != -1 || code.indexOf("1UBV01") != -1) {
    Demo1(entities, code);
  }else if(code.indexOf("1UBD02") != -1) {
    Demo2(entities, code);
  }else if(code.indexOf("1UBD03") != -1) {
    Demo3(entities, code);
  }else if(code.indexOf("D") != -1){
    feedbackFN(true);
  }else if(code.indexOf("1UB01") != -1) {
     OneUBOne(entities, code);
  }else if(code.indexOf("1UB02") != -1) {
     OneUBTwo(entities, code);
  }
  // else if(code.indexOf("1UB03") != -1) {
  //    OneUBThree(entities, code);
  // }else if(code.indexOf("1UB04") != -1) {
  //    OneUBFour(entities, code);
  // }else if(code.indexOf("1UB05") != -1) {
  //    OneUBFive(entities, code);
  // }else if(code.indexOf("1UB06") != -1) {
  //    OneUBSix(entities, code);
  // }else if(code.indexOf("1UB07") != -1) {
  //    OneUBSeven(entities, code);
  // }else if(code.indexOf("1UB08") != -1) {
  //    OneUBEight(entities, code);
  // }else if(code.indexOf("1UB09") != -1) {
  //    OneUBNine(entities, code);
  // }else if(code.indexOf("1UB10") != -1) {
  //    OneUBTen(entities, code);
  // }else if(code.indexOf("1UB11") != -1) {
  //    OneUBEleven(entities, code);
  // }else if(code.indexOf("1UB12") != -1) {
  //    OneUBTwelve(entities, code);
  // }else if(code.indexOf("1UB13") != -1) {
  //    OneUBThirteen(entities, code);
  // }else if(code.indexOf("1UB14") != -1) {
  //    OneUBFourteen(entities, code);
  // }else if(code.indexOf("1UB15") != -1) {
  //    OneUBFifteen(entities, code);
  // }
}

//@fb instanceOf boolean
// true === correct
// false === incorrect
function feedbackFN(fb) {
  if(fb) {
    $("body").css("background-color", "rgb(210, 255, 203)");
    $(".question-text").css("background-color", "rgb(210, 255, 203)");
    audioRight.play();
  }else {
    $("body").css("background-color", "rgb(255, 216, 216)");
    $(".question-text").css("background-color", "rgb(255, 216, 216)");
    audioWrong.play();
  }
}

// Converts a SAT.Polygon into a SVG path string.
function poly2path(polygon) {
  var pos = polygon.pos;
  var points = polygon.calcPoints;
  var result = 'M' + pos.x + ' ' + pos.y;
  result += 'M' + (pos.x + points[0].x) + ' ' + (pos.y + points[0].y);
  for (var i = 1; i < points.length; i++) {
    var point = points[i];
    result += 'L' + (pos.x + point.x) + ' ' + (pos.y + point.y);
  }
  result += 'Z';
  return result;
}

// Create a Raphael start drag handler for specified entity
function startDrag(entity, world) {
  return function (dx, dy) {
    var rect = world.canvas.canvas.getBoundingClientRect();
    var cursor = V(dx - rect.left, dy - rect.top);
    all_moved = true;
    option_selected = true;
    if(!locked) {
      time_mouse_down = performance.now();
      if(SAT.pointInPolygon(cursor, entity.data)) {
        if (event.touches.length == 2) {
          hand1 = event.touches[0];
          hand2 = event.touches[1];
          drag_rotation = true;
          drag_mode = 2;
        }
        else if(entity.data.calcPoints.length >= 20) {
          var first_point = V((entity.data.calcPoints[0]).x + entity.data.pos.x, (entity.data.calcPoints[0]).y + entity.data.pos.y);
          var last_point = V((entity.data.calcPoints[entity.data.calcPoints.length - 1]).x + entity.data.pos.x, (entity.data.calcPoints[entity.data.calcPoints.length - 1]).y + entity.data.pos.y);
          //important for quarter-circles
          var second_point = V((entity.data.calcPoints[1]).x + entity.data.pos.x, (entity.data.calcPoints[1]).y + entity.data.pos.y);
          if(Math.abs(cursor.x - first_point.x) <= 25 && Math.abs(cursor.y - first_point.y) <= 25) {
            drag_rotation = true;
            drag_mode = 1;
            rotation_point.x = cursor.x; rotation_point.y = cursor.y;
            old_cursor.x = cursor.x; old_cursor.y = cursor.y;
            original_angle = entity.data.angle;
          }else if(Math.abs(cursor.x - second_point.x) <= 25 && Math.abs(cursor.y - second_point.y) <= 25) {
            drag_rotation = true;
            drag_mode = 1;
            rotation_point.x = cursor.x; rotation_point.y = cursor.y;
            old_cursor.x = cursor.x; old_cursor.y = cursor.y;
            original_angle = entity.data.angle;
          }else if(Math.abs(cursor.x - last_point.x) <= 25 && Math.abs(cursor.y - last_point.y) <= 25) {
            drag_rotation = true;
            drag_mode = 1;
            rotation_point.x = cursor.x; rotation_point.y = cursor.y;
            old_cursor.x = cursor.x; old_cursor.y = cursor.y;
            original_angle = entity.data.angle;
          }
        }else if(entity.data.calcPoints.length <= 10){
          Object.keys(entity.data.calcPoints).forEach(function(key) {
            var p = entity.data.calcPoints[key];
            var p_absolute = V(p.x + entity.data.pos.x, p.y + entity.data.pos.y);
            if(Math.abs(cursor.x - p_absolute.x) <= 40 && Math.abs(cursor.y - p_absolute.y) <= 40) {
              drag_rotation = true;
              drag_mode = 1;
              rotation_point.x = cursor.x; rotation_point.y = cursor.y;
              old_cursor.x = cursor.x; old_cursor.y = cursor.y;
              original_angle = entity.data.angle;
            }
          });
        
      }
    }
      this.ox = entity.data.pos.x;
      this.oy = entity.data.pos.y;
      draggedEntity = entity;
    }
  };
}

// Create a Raphael move drag handler for specified entity
function moveDrag(entity, world) {
  return function (dx, dy, x, y, e) {
    //drawInnerCircle(entity);
    var entity_old_x = entity.data.pos.x;
    var entity_old_y = entity.data.pos.y;

    // if(!all_moved) {
    //   checkMoving(entity, world);
    // }

    var rect = world.canvas.canvas.getBoundingClientRect();
    //var cursor = V(dx - rect.left, dy - rect.top);
    // var cursorX = e.clientX - rect.left;
    // var cursorY = e.clientY - rect.top;
    // var cursor = V(cursorX, cursorY);
    
    // Use the calculated angle to rotate the square figure by the same amount
    var cursor = V(rotation_point.x + dx, rotation_point.y + dy);
    if(!locked) {
      if (drag_rotation === true) {
        if (drag_mode == 1) {
          var dAngle = getAngle(entity.data.pos, old_cursor, cursor);
          // log_e.push(entity.id);
          // log_a.push(dAngle * 180 / Math.PI);
          // log_c.push(cursor);
          // log_d.push(dx + ":" + dy);
          // log_oc.push(old_cursor);
          var old_angle = entity.data.angle;
          //log_total.push(old_angle + dAngle);
          total_angle += dAngle;
          entity.data.setAngle(old_angle + dAngle);
          // if(total_angle >= 0.261799) {
          //   entity.data.setAngle(old_angle + 0.261799);
          //   total_angle = 0;
          // }else if(total_angle <= -0.261799) {
          //   entity.data.setAngle(old_angle - 0.261799);
          //   total_angle = 0;
          // }
          
          //entity.data.setAngle(roundToNearest(total_angle, 0.261799));
          old_cursor.x = cursor.x; old_cursor.y = cursor.y;
        }
        else if (drag_mode == 2) {
          hand1 = event.touches[0];
          hand2 = event.touches[1];
        
          // Calculate the angle between the hands as they move
          dx = hand2.pageX - hand1.pageX;
          dy = hand2.pageY - hand1.pageY;
          var dangle = Math.atan2(dy, dx);
          let currentDistance = Math.sqrt(dx*dx + dy*dy);
        
          var old_angle = entity.data.angle;
          var diff_angle = dangle + old_angle;
          var rotationAngle = diff_angle % 180;
        
          // Apply a fraction of the difference to the entity's angle on each frame
          var fraction = 0.5; // adjust this value to control the smoothness of the rotation
          entity.data.setAngle(rotationAngle * fraction);
        }
      } else {
        entity.data.pos.x = this.ox + dx;
        entity.data.pos.y = this.oy + dy;
      }
      
      /*if (entity.data.angle >= 6.2 || entity.data.angle <= -6.2) {
        entity.data.angle = old_angle;
      }*/
      
      var b_pos = checkBoundaries(entity);
      entity.data.pos.x = entity.data.pos.x - b_pos.x;
      entity.data.pos.y = entity.data.pos.y - b_pos.y;
      world.simulate();
    }
  };
}
// Create a Raphael end drag handler for specified entity
function endDrag(entity) {
  return function () {
    if(!locked) {
      time_mouse_up = performance.now();
      previous_angle = 0;
      invert = false;
      drag_rotation = false;
      entity.data.setAngle(Math.round(entity.data.angle/0.261799) * 0.261799);
      moves++;
      entity.updateDisplay();
      world.simulate();
      //entity.updateDisplay();
    }
  };
}

function checkMoving(entity, world) {
  var world_ids = [];
  var already_in = false;
  for (var i = 0; i < moved.length; i++) {
    if(moved[i] == entity.id) {
      already_in = true;
    }
  }
  if(!already_in) {
    moved.push(entity.id);
  }
  if(moved.length >= Object.keys(world.entities).length) {
    all_moved = true;
  }
}

//corrects the rotation_angle according to mouse-direction
function getRotationAngle(entity, cursor) {

  var c = V(cursor.x - entity.data.pos.x, entity.data.pos.y - cursor.y);
  var r = V(rotation_point.x - entity.data.pos.x, entity.data.pos.y - rotation_point.y);

  var t = (r.x + r.y)/(c.x + c.y);
  var c_tranformed = V(t*c.x, t*c.y);
  var d = c_tranformed.x / c.len();
  var alpha = 0;
  if(Math.abs(d) > 1) {
    d = d-1;
    alpha = Math.acos(d) + Math.PI;
  }else {
    alpha = Math.acos(d);
  }
  if(isNaN(alpha)) {
    var stop = true;
  }

  return -alpha;

}

// cx,cy center of rotation
// ox,oy old position of mouse
// mx,my new position of mouse.
function getAngle(center, old_cursor, cursor){
    var x1 = old_cursor.x - center.x;
    var y1 = old_cursor.y - center.y;
    var x2 = cursor.x - center.x;
    var y2 = cursor.y - center.y;
    var d1 = Math.max(0.001, Math.sqrt(x1 * x1 + y1 * y1));
    var d2 = Math.max(0.001, Math.sqrt(x2 * x2 + y2 * y2));

    return Math.asin((x1 / d1) * (y2 / d2) - (y1 / d1) * (x2 / d2));
}

function roundToNearest(numToRound, numToRoundTo) {
    numToRoundTo = 1 / (numToRoundTo);

    return Math.round(numToRound * numToRoundTo) / numToRoundTo;
}

function checkBoundaries(entity) {
  var x = 0;
  var y = 0;
  var furthest_point_right = 0;
  var furthest_point_bottom = 0;
  var furthest_point_left = 0;
  var furthest_point_top = 0;
  if(entity.data instanceof SAT.Circle) {
    if(entity.data.pos.x < 45) {
      x = entity.data.pos.x - 45;
    }else if(entity.data.pos.x > 475) {
      x = entity.data.pos.x - 475;
    }
    if(entity.data.pos.y < 45) {
      y = entity.data.pos.y - 45;
    }else if(entity.data.pos.y > 495) {
      y = entity.data.pos.y - 495;
    }
  }else {
    Object.keys(entity.data.calcPoints).forEach(function(key) {
      var p = entity.data.calcPoints[key];
      var point_x = p.x + entity.data.pos.x;
      var point_y = p.y + entity.data.pos.y;
      if(point_x > furthest_point_right) {
        furthest_point_right = point_x;
      }else if(point_x < furthest_point_left) {
        furthest_point_left = point_x;
      }
      if(point_y > furthest_point_bottom) {
        furthest_point_bottom = point_y;
      }else if(point_y < furthest_point_top) {
        furthest_point_top = point_y;
      }
    });

    if(questionCode.indexOf("Test") != -1) {
      if(furthest_point_right > 900) {
        x = furthest_point_right - 900;
      }else if(furthest_point_left < 0) {
        x = furthest_point_left;
      }
      if(furthest_point_bottom > 650) {
        y = furthest_point_bottom - 650;
      }else if(furthest_point_top < 0) {
        y = furthest_point_top;
      }
    }else {
      if(furthest_point_right > 900) {
        x = furthest_point_right - 900;
      }else if(furthest_point_left < 0) {
        x = furthest_point_left;
      }
      if(furthest_point_bottom > 720) {
        y = furthest_point_bottom - 720;
      }else if(furthest_point_top < 0) {
        y = furthest_point_top;
      }
    }
  }
  return V(x, y);
}

var idCounter = 0;

function noop() {}

function Entity(data, display, options) {
  options = _.defaults(options || {}, {
    solid: false, // Whether this object is "solid" and therefore should participate in responses.
    heavy: false, // Whether this object is "heavy" and can't be moved by other objects.
    displayAttrs: {}, // Raphael attrs to set on the display object
    onCollide: noop, // Function to execute when this entity collides with another - arguments are (otherEntity, response)
    onTick: function() {
      var v = checkBoundaries(this);
      this.data.pos.x = this.data.pos.x - v.x;
      this.data.pos.y = this.data.pos.y - v.y;
      this.updateDisplay();
    } // Function called at the start of every simulation tick - no arguments
  });
  this.id = idCounter++;
  this.data = data;
  this.display = display;
  this.displayAttrs = _.extend({
    stroke: ""
  }, options.displayAttrs);
  this.isSolid = options.solid;
  this.isHeavy = options.heavy;
  this.onCollide = options.onCollide;
  this.onTick = options.onTick;
}
Entity.prototype = {
  remove: function () {
    this.display.remove();
  },
  // Call this to update the display after changing the underlying data.
  updateDisplay: function () {
    if (this.data instanceof SAT.Circle) {
      this.displayAttrs.cx = this.data.pos.x;
      this.displayAttrs.cy = this.data.pos.y;
      this.displayAttrs.r = this.data.r;
    } else {
      this.displayAttrs.path = poly2path(this.data);
    }
    this.display.attr(this.displayAttrs);
  },
  tick: function () {
    this.onTick();
  },
  respondToCollision: function (other, response) {
    this.onCollide(other, response);
    // Collisions between "ghostly" objects don't matter, and
    // two "heavy" objects will just remain where they are.
    if (this.isSolid && other.isSolid &&
      !(this.isHeavy && other.isHeavy)) {
      if (this.isHeavy) {
        // Move the other object out of us
        other.data.pos.add(response.overlapV);
      } else if (other.isHeavy) {
        // Move us out of the other object
        this.data.pos.sub(response.overlapV);
      } else {
        // Move equally out of each other
        response.overlapV.scale(0.5);
        this.data.pos.sub(response.overlapV);
        other.data.pos.add(response.overlapV);
      }
    }else {
      // Move equally out of each other
        if(this === draggedEntity) {
          this.data.pos.sub(response.overlapV);
        }else if(other === draggedEntity) {
         other.data.pos.add(response.overlapV);
        }
    }
  }
};

function World(canvas, options) {
  options = _.defaults(options || {},  {
    loopCount: 2 // number of loops to do each time simulation is called. The higher the more accurate the simulation, but slowers.
  });
  this.canvas = canvas; // A raphael.js canvas
  this.response = new SAT.Response(); // Response reused for collisions
  this.loopCount = options.loopCount;
  this.entities = {};
}
World.prototype = {
  addEntity: function(data, options) {
    var entity = new Entity(
      data,
      data instanceof SAT.Circle ? this.canvas.circle() : this.canvas.path(),
      options
    );
    // Make the display item draggable if requested.
    if (options.draggable) {
      entity.display.drag(moveDrag(entity, this), startDrag(entity, this), endDrag(entity));
    }
    entity.updateDisplay();
    this.entities[entity.id] = entity;
    return entity;
  },
  removeEntity: function (entity) {
    entity.remove();
    delete this.entities[entity.id];
  },
  simulate: function () {
    var entities = _.values(this.entities);
    var entitiesLen = entities.length;
    var overlapV_container = [];
    // Let the entity do something every simulation tick
    _.each(entities, function (entity) {
      entity.tick();
    });
    // Handle collisions - loop a configurable number of times to let things "settle"
    var loopCount = this.loopCount;
    for (var i = 0; i < loopCount; i++) {
      // Naively check for collision between all pairs of entities 
      // E.g if there are 4 entities: (0, 1), (0, 2), (0, 3), (1, 2), (1, 3), (2, 3)
      for (var aCount = 0; aCount < entitiesLen; aCount++) {
        var a = entities[aCount];
        for (var bCount = aCount + 1; bCount < entitiesLen; bCount++) {
          var b = entities[bCount];
          this.response.clear();
          var collided;
          var aData = a.data;
          var bData = b.data;
          if (aData instanceof SAT.Circle) {
            if (bData instanceof SAT.Circle) {
              collided = SAT.testCircleCircle(aData, bData, this.response);
            } else {
              collided = SAT.testCirclePolygon(aData, bData, this.response);
            }
          } else {
            if (bData instanceof SAT.Circle) {
              collided = SAT.testPolygonCircle(aData, bData, this.response);
            } else {
              collided = SAT.testPolygonPolygon(aData, bData, this.response);
            }
          }
          if (collided) {
            if(a === draggedEntity) {
              overlapV_container.push(this.response.overlapV);
            }
            a.respondToCollision(b, this.response);
          }
        }
        var b_pos = checkBoundaries(a);
        a.data.pos.x = a.data.pos.x - b_pos.x;
        a.data.pos.y = a.data.pos.y - b_pos.y;
      }
    }
    // var x = 0;
    // var y = 0;
    // for (var i = overlapV_container.length - 1; i >= 0; i--) {
    //   var overlapV = overlapV_container[i];
    //   x = x + overlapV.x;
    //   y = y + overlapV.y;
    // }
    //var ultimate_overlapV = V(x, y);
    //draggedEntity.data.pos.add(ultimate_overlapV);
    // Finally, update the display of each entity now that the simulation step is done.
    _.each(entities, function (entity) {
      entity.updateDisplay();
    });
  }
};
  //----------------------------------------------------------------------------
  //Functions for Evaluation
  //----------------------------------------------------------------------------

  function evaluateCalcPoints_old(entities, evaluation_points) {
    var points_counter = 0;
    var xes = 0;
    var yes = 0;

    Object.keys(entities).forEach(function(key) {
      entity = entities[key];
      Object.keys(entity.data.calcPoints).forEach(function(key2) {
        var calcPoint = entity.data.calcPoints[key2];
        var point = V(calcPoint.x + entity.data.pos.x, calcPoint.y + entity.data.pos.y);
        points_counter++;
        xes = xes + point.x;
        yes = yes + point.y;
      });
    });

    centroid = V(xes/points_counter, yes/points_counter);

    var correct = false;
    var evaluation_points_max_rotated_positive = [];
    var evaluation_points_max_rotated_negative = [];

    //checks if the shape is rotated to the left at maximum 15 degrees
    for (i = 0; i < evaluation_points.length; i++) {
      var evaluation_point = evaluation_points[i];
      var rotated_point = V(Math.cos(0.261799)*evaluation_point.x - Math.sin(0.261799)*(-evaluation_point.y), (Math.sin(0.261799)*evaluation_point.x + Math.cos(0.261799)*(-evaluation_point.y))*(-1));
      evaluation_points_max_rotated_positive.push(rotated_point);
    }
    // //checks if the shape is rotated to the right at maximum 15 degrees
    for (i = 0; i < evaluation_points.length; i++) {
      var evaluation_point = evaluation_points[i];
      var rotated_point = V(Math.cos(-0.261799)*evaluation_point.x - Math.sin(-0.261799)*(-evaluation_point.y), (Math.sin(-0.261799)*evaluation_point.x + Math.cos(-0.261799)*(-evaluation_point.y))*(-1));
      evaluation_points_max_rotated_negative.push(rotated_point);
    }

    var evaluation_points_total = [evaluation_points, evaluation_points_max_rotated_positive, evaluation_points_max_rotated_negative];
    //check if the points are in the expected position (probably looping over all the points and checking for each possible combination)
    //1. establish the original Figure, its position becomes V(0, 0)
    var original_entity;
    Object.keys(entities).forEach(function(key) {
      var entity = entities[key];
      if(original_entity == null) {
        original_entity = entity;
      }else {
        if(entity.data.pos.y - original_entity.data.pos.y < -60) {
          original_entity = entity;
        }else if(!(entity.data.pos.y - original_entity.data.pos.y > 60)) {
          if(Math.abs(entity.data.pos.x - original_entity.data.pos.x) >= 5) {
            if(entity.data.pos.x < original_entity.data.pos.x) {
              original_entity = entity;
            }
          }
        }
      }
    });

    //2. define all relative points of all figures, according to the original entity
    var relative_points = [];
    Object.keys(entities).forEach(function(key) {
      var entity = entities[key];
      var offset = V(entity.data.pos.x - centroid.x, entity.data.pos.y - centroid.y);
      Object.keys(entity.data.calcPoints).forEach(function(key_point) {
        var calcPoint = entity.data.calcPoints[key_point];
        var relative_point = V(calcPoint.x + offset.x, calcPoint.y + offset.y);
        relative_points.push(relative_point);
      });
    });
    //3. loop over every evaluation point and see if any relative point matches to any of them
    Object.keys(evaluation_points_total).forEach(function(key_eval) {
      var evaluation_points_current = evaluation_points_total[key_eval];
      Object.keys(relative_points).forEach(function(key_relative) {
        var relative_point = relative_points[key_relative];
        for (i = 0; i < evaluation_points_current.length; i++) {
          var evaluation_point = evaluation_points_current[i];
          if(relative_point.x <= evaluation_point.x + 5 && relative_point.x >= evaluation_point.x - 5 && relative_point.y <= evaluation_point.y + 5 && relative_point.y >= evaluation_point.y - 5) {
            evaluation_points_current.splice(parseInt(i), 1);
            break;
          }
        }
      });
    //   //4. if there is any Point from any Figure that doesnt match any pre-defined correct Point, then the try is evaluated 'Wrong'
      if(evaluation_points_current.length == 0) {
        correct = true;
        answered_correctly = true;
      }
    });
    if(questionCode.indexOf("FNR10") != -1 && !correct && variation_counter == 0) {
      variation_counter = 1;
      correct = evaluateCalcPoints(entities, R10_2);
    }else if(questionCode.indexOf("FNR11") != -1 && !correct && variation_counter == 0) {
      variation_counter = 1;
      correct = evaluateCalcPoints(entities, R11_2);
    }else if(questionCode.indexOf("FNR14") != -1 && !correct && variation_counter == 0) {
      variation_counter = 1;
      correct = evaluateCalcPoints(entities, R14_2);
    }
    return correct;
  }

  
//test
//____________________________________________________________________________________________
 function evaluateCalcPoints(entities, evaluation_points) {
    var points_counter = 0;
    var xes = 0;
    var yes = 0;
    var rotates = [0.261799, -0.261799, 0.523599, 0.785398, 1.0472, 1.309, 1.5708, 1.8326, 2.0944, 2.35619, 2.61799, 2.87979, 3.14159, -0.523599, -0.785398, -1.0472, -1.309, -1.5708, -1.8326, -2.0944, -2.35619, -2.61799, -2.87979];

    Object.keys(entities).forEach(function(key) {
      entity = entities[key];
      Object.keys(entity.data.calcPoints).forEach(function(key2) {
        var calcPoint = entity.data.calcPoints[key2];
        var point = V(calcPoint.x + entity.data.pos.x, calcPoint.y + entity.data.pos.y);
        points_counter++;
        xes = xes + point.x;
        yes = yes + point.y;
      });
    });

    centroid = V(xes/points_counter, yes/points_counter);

    var correct = false;
    var eval_points_collection = [];
    eval_points_collection.push(evaluation_points);

    //rotates the shape in every possible position in 15deg steps
    for(j = 0; j < rotates.length; j++) {
      let eval_points = [];
      let angle = rotates[j];
      for (i = 0; i < evaluation_points.length; i++) {
        var evaluation_point = evaluation_points[i];
        var rotated_point = V(Math.cos(angle)*evaluation_point.x - Math.sin(angle)*(-evaluation_point.y), (Math.sin(angle)*evaluation_point.x + Math.cos(angle)*(-evaluation_point.y))*(-1));
        eval_points.push(rotated_point);
      }
      eval_points_collection.push(eval_points);
    }

    //define all relative points of all entities, according to the centroid of the whole shape
    var relative_points = [];
    Object.keys(entities).forEach(function(key) {
      var entity = entities[key];
      var offset = V(entity.data.pos.x - centroid.x, entity.data.pos.y - centroid.y);
      Object.keys(entity.data.calcPoints).forEach(function(key_point) {
        var calcPoint = entity.data.calcPoints[key_point];
        var relative_point = V(calcPoint.x + offset.x, calcPoint.y + offset.y);
        relative_points.push(relative_point);
      });
    });

    //loop over every possible rotation and loop over their points and check if they match the points of the shape
    let correct_rotation_counter = 0;
    Object.keys(eval_points_collection).forEach(function(key_eval) {
      var evaluation_points_current = eval_points_collection[key_eval];
      Object.keys(relative_points).forEach(function(key_relative) {
        var relative_point = relative_points[key_relative];
        for (i = 0; i < evaluation_points_current.length; i++) {
          var evaluation_point = evaluation_points_current[i];
          if(relative_point.x <= evaluation_point.x + 5 && relative_point.x >= evaluation_point.x - 5 && relative_point.y <= evaluation_point.y + 5 && relative_point.y >= evaluation_point.y - 5) {
            evaluation_points_current.splice(parseInt(i), 1);
            break;
          }
        }
      });

      //if there is any Point from any Figure that doesnt match any pre-defined correct Point, then the try is evaluated 'Wrong'
      if(evaluation_points_current.length == 0) {
        correct = true;
        if(correct_rotation_counter < 3) {
          answered_correctly = true;
          correctly_rotated = true;
        }
        if(correct_rotation_counter == 0) {
          angle_of_shape = 0;
        }else {
          angle_of_shape = rotates[correct_rotation_counter - 1];
        }
      }
      correct_rotation_counter++;
    });

    if(questionCode.indexOf("FNR10") != -1 && !correct && variation_counter == 0) {
      variation_counter = 1;
      correct = evaluateCalcPoints(entities, R10_2);
    }else if(questionCode.indexOf("FNR11") != -1 && !correct && variation_counter == 0) {
      variation_counter = 1;
      correct = evaluateCalcPoints(entities, R11_2);
    }else if(questionCode.indexOf("FNR14") != -1 && !correct && variation_counter == 0) {
      variation_counter = 1;
      correct = evaluateCalcPoints(entities, R14_2);
    }
    return correct;
  }