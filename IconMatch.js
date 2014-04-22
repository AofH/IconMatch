



var SQUARE_LENGTH = 50;
var GRID_SIZE = 10;
var GRID_WIDTH_BOUND = SQUARE_LENGTH * GRID_SIZE; // Calculates how big the grid needs to be taking into account square size and the 1 px border size
var GRID_HEIGHT_BOUND = SQUARE_LENGTH * GRID_SIZE; // Same as above
var GRID_PADDING = 10;

var CANVAS_WIDTH = GRID_WIDTH_BOUND + (GRID_PADDING * 2) + 1;
var CANVAS_HEIGHT = GRID_HEIGHT_BOUND + (GRID_PADDING * 2) + 1;

var RED = "rgb(255, 0, 0)";
var ORANGE = "rgb(255, 128, 0)";
var YELLOW = "rgb(255, 255, 0)";
var GREEN = "rgb(0, 255, 0)";
var CYAN = "rgb(0, 255, 255)";
var LIGHTBLUE = "rgb(0, 128,255)";
var BLUE = "rgb(0, 0, 255)";
var PURPLE = "rgb(127, 0 , 255)";
var PINK = "rgb(255, 0 , 127)";
var BURNTUMBER = "rgb(138, 52, 36)";

var BOX_SELECTION_COLOR = BURNTUMBER;



var _canvas;
var _ctx;

function init(){


	_canvas = document.getElementById('canvas');
	_canvas.height = CANVAS_WIDTH;
	_canvas.width = CANVAS_HEIGHT;
	_canvas.style.border = "1px solid black";

	_canvas.addEventListener("mousedown", getPosition, false);


	_ctx = _canvas.getContext('2d');
	draw();
}


function draw() {
	
	drawBlocks();
	drawGrid();
	
	

}

function getPosition(event) {
	var x = new Number();
    var y = new Number();
    
    if (event.x != undefined && event.y != undefined)
    {
        x = event.x;
        y = event.y;
    } else { // Firefox method to get the position
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= _canvas.offsetLeft;
    y -= _canvas.offsetTop;
	
	draw();
    console.log("x: " + x + "  y: " + y);
    var selectedBoxCoords = getTopLeftCorner(x, y);

    drawSelectedBoxOutline(selectedBoxCoords.x, selectedBoxCoords.y);
}

function getTopLeftCorner(x, y){
	var topLeft = {
		x: GRID_PADDING,
		y: GRID_PADDING
	}

	var topX = Math.floor(x/SQUARE_LENGTH) * SQUARE_LENGTH + GRID_PADDING;
	var topY = Math.floor(y/SQUARE_LENGTH) * SQUARE_LENGTH + GRID_PADDING;

	topLeft.x = topX;
	topLeft.y = topY;
	

	console.log("topX: "+ topX+ " topY: "+ topY);

	return topLeft;
}

function drawSelectedBoxOutline(x, y){
	_ctx.strokeStyle = "#FFE7BA";
	_ctx.strokeRect(x+1,y+1,SQUARE_LENGTH,SQUARE_LENGTH);
}

function drawBlocks(){
	_ctx.fillStyle = LIGHTBLUE;
	_ctx.fillRect(GRID_PADDING, GRID_PADDING, SQUARE_LENGTH, SQUARE_LENGTH);

	_ctx.fillStyle = BLUE;
	_ctx.fillRect(GRID_PADDING ,SQUARE_LENGTH + GRID_PADDING,SQUARE_LENGTH,SQUARE_LENGTH);
}

function drawGrid(){
	//Draw the vertical lines
	for(var x = 0; x <= GRID_WIDTH_BOUND; x += SQUARE_LENGTH) {
		_ctx.moveTo(1 + x + GRID_PADDING , GRID_PADDING);
		_ctx.lineTo(1 + x + GRID_PADDING , GRID_HEIGHT_BOUND + GRID_PADDING);
	}
	//Draw the horizontal lines
	for(var x = 0; x <= GRID_HEIGHT_BOUND; x += SQUARE_LENGTH) {
		_ctx.moveTo( GRID_PADDING, 1 + x + GRID_PADDING);
		_ctx.lineTo( GRID_WIDTH_BOUND + GRID_PADDING ,1 + x + GRID_PADDING);
	}

	_ctx.strokeStyle = "black";
	_ctx.stroke();
}
