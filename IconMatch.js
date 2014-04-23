var _canvas;
var _ctx;
var _board;
var _selectedBox;
var _gameOver;
var _timer;

var _requestAnimationFrame =  
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {
          return setTimeout(callback, 1);
        };


function init(){


	_canvas = document.getElementById('canvas');
	_canvas.height = CANVAS_HEIGHT;
	_canvas.width = CANVAS_WIDTH; ;
	_canvas.style.border = "1px solid black";

	_canvas.addEventListener("mousedown", getPosition, false);

	_selectedBox = {
		selected:false,
		x:GRID_PADDING,
		y:GRID_PADDING 
    }

    _timer = new Timer(TIMER_LOCATION_X, TIMER_LOCATION_Y, TIMER_LENGTH, TIMER_HEIGHT, 30);
	initBoard();


	_ctx = _canvas.getContext('2d');
	draw();
}

function initBoard(){
	
	_board = new Board(EASY);
	_board.generateInteriorBoard();
	_board.generateWholeBoard();

}


function draw(now) {
	
	_timer.update(now);

	_ctx.clearRect(0,0,_canvas.width,_canvas.height);
	drawBlocks();
	drawGrid();
	
	if(_selectedBox.selected === true){

		var selectedBoxCoords = getTopLeftCorner(_selectedBox.x, _selectedBox.y);
		drawSelectedBoxOutline(selectedBoxCoords.x, selectedBoxCoords.y);
	}
	
	if(_gameOver || _timer.timeRemaining <= 0)
	{
		_gameOver = true;
		if(_board.empty()){
			
			drawText("You Win!");
			drawRetryButton();
		} else {
			drawText("You Lose!");
			drawRetryButton();
		}
	} else {
		drawTimer();
		_requestAnimationFrame(draw);
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
    console.log('X: '+x + " y: "+y);
	
	if(_gameOver) {
		if(x>= RETRY_BUTTON_X && x < RETRY_BUTTON_X + RETRY_BUTTON_WIDTH) {
			if(y >= RETRY_BUTTON_Y && y < RETRY_BUTTON_Y +RETRY_BUTTON_HEIGHT)
			{
				console.log("RETRY");
			}
		}	

	
	} else {
		//Apply custom offset for box detection
		x -= GRID_PADDING * 2 - 8; //Wierd magic 8 which makes detection work 100%
		y -= GRID_PADDING * 2 - 8;
		
		if ((x < CANVAS_WIDTH - GRID_PADDING * 2 && x > GRID_PADDING*2) && (y < CANVAS_HEIGHT - GRID_PADDING * 2 && y > GRID_PADDING*2)) {
		    if(_board.isValidBox(x,y)){
		    	if(_selectedBox.selected === false) {
			    	_selectedBox.selected = true;
			    	_selectedBox.x = x;
			    	_selectedBox.y = y;

			    	
		    	} else {
		    		_selectedBox.selected = false;
		    		//compare currentSelectoin
		    		var validMove = _board.compareBoxes(_selectedBox.x,_selectedBox.y, x,y);
		    		_gameOver = _board.empty();

		    	}
		    }
	    }
    }
}

function getTopLeftCorner(x, y){
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
		_ctx.lineTo( GRID_WIDTH_BOUND + GRID_PADDING+2 ,1 + x + GRID_PADDING);
	}

	_ctx.strokeStyle = BLACK;
	_ctx.stroke();
}

function drawTimer() {
	_ctx.fillStyle = _timer.timerColor;
	_ctx.fillRect(_timer.x,_timer.y, _timer.width, _timer.height);
}

function drawText(text) {
	_ctx.fillStyle = BLACK;
	_ctx.font = "bold 16px Arial";
	_ctx.fillText(text, GAME_OVER_TEXT_X, GAME_OVER_TEXT_Y);
}

function drawRetryButton(){
	_ctx.fillStyle = GREEN;
	_ctx.fillRect(RETRY_BUTTON_X,RETRY_BUTTON_Y,RETRY_BUTTON_WIDTH,RETRY_BUTTON_HEIGHT);

	_ctx.fillStyle = BLACK;
	_ctx.font = "bold 16px Arial";
	_ctx.fillText("Play Again", RETRY_BUTTON_X+10,RETRY_BUTTON_Y+25);
}