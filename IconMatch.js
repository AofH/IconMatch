
// 7, 14, 12, 2, 0, 8, 5, 10, 4, 11, 15, 6, 13, 9, 1, 3


var SQUARE_LENGTH = 50;
var GRID_SIZE = 10;
var GRID_WIDTH_BOUND = SQUARE_LENGTH * GRID_SIZE; 
var GRID_HEIGHT_BOUND = SQUARE_LENGTH * GRID_SIZE; 
var GRID_PADDING = 10;

var CANVAS_WIDTH = GRID_WIDTH_BOUND + (GRID_PADDING * 2) + 1;
var CANVAS_HEIGHT = GRID_HEIGHT_BOUND + (GRID_PADDING * 2) + 1;

var BOARD_SIZE = 8;

var EMPTY = 0;

var EASY = 4;
var MEDIUM = 6;
var HARD = 8;


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

var COLOR_ARRAY = [ORANGE,YELLOW, GREEN, CYAN, LIGHTBLUE, BLUE, PURPLE, PINK, BURNTUMBER];


var _canvas;
var _ctx;
var _board;
var _selectedBox;

function init(){


	_canvas = document.getElementById('canvas');
	_canvas.height = CANVAS_WIDTH;
	_canvas.width = CANVAS_HEIGHT;
	_canvas.style.border = "1px solid black";

	_canvas.addEventListener("mousedown", getPosition, false);

	_selectedBox = {
		selected:false,
		x:GRID_PADDING,
		y:GRID_PADDING 
    }


	initBoard();


	_ctx = _canvas.getContext('2d');
	draw();
}

function initBoard(){
	
	_board = new Board(EASY);
	_board.generateInteriorBoard();
	_board.generateWholeBoard();

}


function draw() {
	
	drawBlocks();
	drawGrid();
	
	if(_selectedBox.selected === true){

		var selectedBoxCoords = getTopLeftCorner(_selectedBox.x, _selectedBox.y);
		drawSelectedBoxOutline(selectedBoxCoords.x, selectedBoxCoords.y);
	}
	

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
    //Apply offsets to the x y variables
    x -= _canvas.offsetLeft;
    y -= _canvas.offsetTop;
	//Custom offset so that the box detection works correctly
	x -= GRID_PADDING * 2 - 8; //Wierd magic 8 which makes detection work 100%
	y -= GRID_PADDING * 2 - 8;


 	// If the mouse pointer is inside the border of the grid, draw.
    if ((x < CANVAS_WIDTH - GRID_PADDING * 2 && x > GRID_PADDING*2) && (y < CANVAS_HEIGHT - GRID_PADDING * 2 && y > GRID_PADDING*2)) {
	    if(_board.isValidBox(x,y)){
	    	if(_selectedBox.selected === false) {
		    	_selectedBox.selected = true;
		    	_selectedBox.x = x;
		    	_selectedBox.y = y;

		    	
	    	} else {
	    		_selectedBox.selected = false;
	    		//compare currentSelectoin

	    		var validMove = _board.compareBoxes(x,y, _selectedBox.x, _selectedBox.y);


	    	}
	    }
	    draw();
    }
}

function getTopLeftCorner(x, y){
	//Add the external Padding offset
	//x -= GRID_PADDING * 2 - 8; //The 8 is the offset that makes the box detection work correctly
	//y -= GRID_PADDING * 2 - 8;

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
	
	var currentBoard = _board.fullBoard;


	for(var i = 0; i< GRID_SIZE; i++) {
		var row = currentBoard[i];
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
