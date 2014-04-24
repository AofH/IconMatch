var _canvas;
var _ctx;
var _board;
var _selectedBox;
var _gameOver;
var _timer;
var _stage;
var _animationId;
var _animationTime;
var _numAddSeconds;

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

	_stage = MENU_STAGE;
	_ctx = _canvas.getContext('2d');

	_animationTime = 0;

	draw();
}

function initGame(difficulty){
	_timer = new Timer(TIMER_LOCATION_X, TIMER_LOCATION_Y, TIMER_LENGTH, TIMER_HEIGHT, 30);

	_selectedBox = {
		selected:false,
		x:GRID_PADDING,
		y:GRID_PADDING 
    }

    _numAddSeconds = NUM_ADD_SECONDS;
    _gameOver = false;
    initBoard(difficulty);
    _stage = GAME_STAGE;
    draw();
}

function initBoard(difficulty){
	
	_board = new Board(difficulty);
	_board.generateInteriorBoard();
	_board.generateWholeBoard();

}


function draw(now) {
	
	_ctx.clearRect(0,0,_canvas.width,_canvas.height);
	if (_stage === MENU_STAGE) {
		drawMenu();
	} else if (_stage === GAME_STAGE) {
		_animationTime = now;
		_timer.update(now);

		
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
			drawAddSecondsButton();
			_requestAnimationFrame(draw);
		}
			
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
    
	if(_stage === MENU_STAGE) {
    	parseMenuClick(x,y);
    } else if(_stage === GAME_STAGE) {
    	parseGameClick(x,y);
    }
}

function parseMenuClick(x,y){
	if(x >= EASY_BUTTON_X && x < EASY_BUTTON_X + MENU_BUTTON_LENGTH &&
	   y >= EASY_BUTTON_Y && y < EASY_BUTTON_Y + MENU_BUTTON_HEIGHT){
		initGame(EASY);
	}

	if(x >= MEDIUM_BUTTON_X && x < MEDIUM_BUTTON_X + MENU_BUTTON_LENGTH &&
	   y >= MEDIUM_BUTTON_Y && y < MEDIUM_BUTTON_Y + MENU_BUTTON_HEIGHT){
		initGame(MEDIUM);
	}

	if(x >= HARD_BUTTON_X && x < HARD_BUTTON_X + MENU_BUTTON_LENGTH &&
	   y >= HARD_BUTTON_Y && y < HARD_BUTTON_Y + MENU_BUTTON_HEIGHT){
		initGame(HARD);
	}
}

function parseGameClick(x,y){
	if(_gameOver) {
		if(x>= RETRY_BUTTON_X && x < RETRY_BUTTON_X + RETRY_BUTTON_WIDTH &&
		   y >= RETRY_BUTTON_Y && y < RETRY_BUTTON_Y +RETRY_BUTTON_HEIGHT) {
			_stage = MENU_STAGE;
			draw();
		}
			
	} else {
		//Check to see if they clicked on the add seconds button
		if(x >= ADD_SECONDS_BUTTON_X && x < ADD_SECONDS_BUTTON_X + ADD_SECONDS_BUTTON_WIDTH && 
		   y >= ADD_SECONDS_BUTTON_Y && y < ADD_SECONDS_BUTTON_Y + ADD_SECONDS_BUTTON_HEIGHT){
			if(_numAddSeconds > 0 ) {
				_timer.addTime(SECONDS_ADDED);
				_numAddSeconds--;
			}
			
		//Check to see if the mouse click is within the grid as we need to add some offset for better box detection
		} else if (x >= GRID_PADDING && x < GRID_WIDTH_BOUND + GRID_PADDING &&  
			       y >= GRID_PADDING && y < GRID_HEIGHT_BOUND + GRID_PADDING){
			
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


			    		//check to see if the game is over by checking to ssee if the board is empty;
			    		_gameOver = _board.empty();

			    		if(!_gameOver) {
				    		var validMoveExists = _board.validMoveExists();
				    		//console.log(validMoveExists);
				    		//if no valid move exists, move the pieces around so that it creates a valid move
				    		if(!validMoveExists){
				    			while(!validMoveExists) {
				    				_board.resetCurrentInterior();
				    				validMoveExists = _board.validMoveExists();
				    			}
				    		}
						}

			    		

			    	}
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
	_ctx.lineWidth = 4;
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
	//beginPath speeds up the draw significantly;
	_ctx.beginPath();
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
	_ctx.lineWidth = 1;
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

function drawMenu(){
	drawTitle();
	drawInstructions();
	drawMenuButton("Easy",EASY_BUTTON_X, EASY_BUTTON_Y, EASY_BUTTON_TEXT_X, EASY_BUTTON_TEXT_Y);
	drawMenuButton("Medium",MEDIUM_BUTTON_X, MEDIUM_BUTTON_Y, MEDIUM_BUTTON_TEXT_X, MEDIUM_BUTTON_TEXT_Y);
	drawMenuButton("Hard",HARD_BUTTON_X, HARD_BUTTON_Y, HARD_BUTTON_TEXT_X, HARD_BUTTON_TEXT_Y);
}

function drawTitle(){
	_ctx.fillStyle = BLACK;
	_ctx.font = "bold 25px Arial";
	_ctx.fillText("Color Match", CANVAS_WIDTH/2 - 85, GRID_PADDING*4);
}

function drawInstructions(){
	_ctx.fillStyle = BLACK;
	_ctx.font = "bold 16px Arial";
	var instructions = "Match boxes by their colors";
	_ctx.fillText(instructions, 140, 100);
	instructions = "and if you can draw a line with 3 or less bends in between them.";
	_ctx.fillText(instructions, 15, 125);
	instructions = "You have 30 seconds to match";
	_ctx.fillText(instructions, 130, 150);
}

function drawMenuButton(text,x,y,textX,textY){
	_ctx.fillStyle = GREEN
	_ctx.fillRect(x,y,MENU_BUTTON_LENGTH,MENU_BUTTON_HEIGHT);
	_ctx.fillStyle = BLACK;
	_ctx.font = "bold 16px Arial";
	_ctx.fillText(text, textX, textY);

}

function drawAddSecondsButton() {
	_ctx.fillStyle = GREEN
	_ctx.fillRect(ADD_SECONDS_BUTTON_X,ADD_SECONDS_BUTTON_Y,ADD_SECONDS_BUTTON_WIDTH,ADD_SECONDS_BUTTON_HEIGHT);
	_ctx.fillStyle = BLACK;
	_ctx.font = "bold 16px Arial";
	_ctx.fillText("Add "+SECONDS_ADDED+" Seconds", ADD_SECONDS_BUTTON_X + 16,ADD_SECONDS_BUTTON_Y+25);
	_ctx.fillText("x" + _numAddSeconds, ADD_SECONDS_BUTTON_X + ADD_SECONDS_BUTTON_WIDTH + 5, ADD_SECONDS_BUTTON_Y + 25);
}