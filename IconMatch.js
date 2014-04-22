



var SQUARE_LENGTH = 50;
var GRID_SIZE = 10;
var GRID_WIDTH_BOUND = SQUARE_LENGTH * GRID_SIZE; 
var GRID_HEIGHT_BOUND = SQUARE_LENGTH * GRID_SIZE; 
var GRID_PADDING = 10;

var CANVAS_WIDTH = GRID_WIDTH_BOUND + (GRID_PADDING * 2) + 1;
var CANVAS_HEIGHT = GRID_HEIGHT_BOUND + (GRID_PADDING * 2) + 1;

var BOARD_SIZE = 4;

var WHITE = "rgb(255,255,255)";
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

var BOX_SELECTION_COLOR = "#FF0000";



var _canvas;
var _ctx;
var _board;

function init(){


	_canvas = document.getElementById('canvas');
	_canvas.height = CANVAS_WIDTH;
	_canvas.width = CANVAS_HEIGHT;
	_canvas.style.border = "1px solid black";

	_canvas.addEventListener("mousedown", getPosition, false);

	initBlocks();


	_ctx = _canvas.getContext('2d');
	draw();
}

function initBlocks(){
	_board = [];
	var coloredYCount = 0;
	for(var i = 0; i< GRID_SIZE; i++) {
		var currentRow = new Array();
		var coloredXCount = 0;
		for(var j = 0; j< GRID_SIZE; j++) {

			if(j >= BOARD_SIZE -1  && coloredXCount < BOARD_SIZE && coloredYCount < BOARD_SIZE && i >= BOARD_SIZE -1) {
				console.log("Pushing Blue");
				currentRow.push(new Block(1,BLUE));
				coloredXCount++;
			} else {
				currentRow.push(new Block(0, WHITE));
			}	
		}

 		if(i >= BOARD_SIZE - 1  && coloredYCount < BOARD_SIZE) {
 			coloredYCount++;
 		}

		_board[i] = currentRow;
	}
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
	
 	// If the mouse pointer is inside the border of the grid, draw.
    if ((x < CANVAS_WIDTH - GRID_PADDING * 2 && x > GRID_PADDING*2) && (y < CANVAS_HEIGHT - GRID_PADDING * 2 && y > GRID_PADDING*2)) {
		draw();

	    var selectedBoxCoords = getTopLeftCorner(x, y);

	    drawSelectedBoxOutline(selectedBoxCoords.x, selectedBoxCoords.y);
    }
}

function getTopLeftCorner(x, y){
	//Add the external Padding offset
	x -= GRID_PADDING * 2 - 8; //The 8 is the offset that makes the box detection work correctly
	y -= GRID_PADDING * 2 - 8;

	var topLeft = {
		x:  Math.floor(x/SQUARE_LENGTH) * SQUARE_LENGTH + GRID_PADDING,
		y: Math.floor(y/SQUARE_LENGTH) * SQUARE_LENGTH + GRID_PADDING
	}

	return topLeft;
}

function drawSelectedBoxOutline(x, y){
	_ctx.strokeStyle = BOX_SELECTION_COLOR;
	_ctx.strokeRect(x+1,y+1,SQUARE_LENGTH,SQUARE_LENGTH);
}

function drawBlocks(){
	
	for(var i = 0; i< GRID_SIZE; i++) {
		var row = _board[i];
		for(var j = 0; j< GRID_SIZE; j++) {
			_ctx.fillStyle = row[j].color;
			_ctx.fillRect(GRID_PADDING + i * SQUARE_LENGTH, GRID_PADDING + j * SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH);
			
		}
	}


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
