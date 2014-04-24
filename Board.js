
function Board(size){
	this.size = size;
	this.gridBorderSize = ((GRID_SIZE - this.size) / 2);
	this.interiorBoard = new Array();
	this.fullBoard = new Array();
	
	this.validMove = function (x, y, objX, objY, numBends, direction){
		
		var tempNumBends = numBends;
		//If we are one box away from the objective, check to see if the line bends. 
		// if it does increment the numBends by one and check to see if it exceeds the bend number
		// if it doesn't then return true we found a second box of the same color within the bend Number bends
		if(x + 1 === objX && y === objY && numBends <= BEND_NUMBER){
			if(direction !== MOVE_RIGHT && numBends + 1 <= BEND_NUMBER) {
				return true;
			} else if (direction === MOVE_RIGHT && numBends <= BEND_NUMBER) {
				return true;
			}
		} else if ( x - 1 === objX && y === objY && numBends <= BEND_NUMBER) {
			if(direction !== MOVE_LEFT && numBends + 1 <= BEND_NUMBER) {
				return true;
			} else if (direction === MOVE_LEFT && numBends <= BEND_NUMBER) {
				return true;
			}
		} else if ( x === objX && y + 1 === objY && numBends <= BEND_NUMBER) {
			if(direction !== MOVE_BOTTOM && numBends + 1 <= BEND_NUMBER) {
				return true;
			} else if (direction === MOVE_BOTTOM && numBends <= BEND_NUMBER) {
				return true;
			}
		} else if ( x === objX && y - 1 === objY && numBends <= BEND_NUMBER) {
			if(direction !== MOVE_TOP && numBends + 1 <= BEND_NUMBER) {
				return true;
			} else if (direction === MOVE_TOP && numBends <= BEND_NUMBER) {
				return true;
			}
		}

		//If the number of bends exceeds the maximum allowed then we didn't find a matching box.
		if (numBends > BEND_NUMBER) {
			return false;
		}
		
		var tempNumBends = 0;
		var move = false;
		//check top
		if(y - 1 > this.gridBorderSize - 1 && this.fullBoard[x][y - 1].id === EMPTY && direction !== MOVE_BOTTOM){
			
			//check to see if the line bends
			if(direction !== MOVE_TOP) {
				tempNumBends = numBends + 1;
			} else {
				tempNumBends = numBends;
			}

			move = this.validMove(x,y - 1, objX , objY ,tempNumBends,MOVE_TOP);
		}
		//check right			
		if(!move && x + 1 < this.gridBorderSize + this.size + 1 && this.fullBoard[x + 1][y].id === EMPTY && direction !== MOVE_LEFT){
			if(direction !== MOVE_RIGHT) {
				tempNumBends = numBends + 1;
			} else {
				tempNumBends = numBends;
			}

			move = this.validMove(x + 1,y,objX,objY,tempNumBends,MOVE_RIGHT);
		}
		//check bottom
		if(!move && y + 1 < this.gridBorderSize + this.size + 1 && this.fullBoard[x][y + 1].id === EMPTY && direction !== MOVE_TOP){
			if(direction !== MOVE_BOTTOM) {
				tempNumBends = numBends + 1;
			} else {
				tempNumBends = numBends;
			}
			move = this.validMove(x,y + 1,objX,objY,tempNumBends,MOVE_BOTTOM);
		}
		//check left
		if(!move && x - 1 > this.gridBorderSize - 1 && this.fullBoard[x - 1][y].id === EMPTY && direction !== MOVE_RIGHT){
			if(direction !== MOVE_LEFT) {
				tempNumBends = numBends + 1;
			} else {
				tempNumBends = numBends;
			}
			move = this.validMove(x - 1,y,objX,objY,tempNumBends,MOVE_LEFT);
		}

		return move;
	}
}

Board.prototype.generateInteriorBoard = function () {
	this.interiorBoard = new Array(); // reset the interior board;

	//generate Empty Board
	for(var i = 0; i < this.size; i++) {
		var currentRow = new Array();
		for (var j = 0; j < this.size; j++) {
			currentRow.push(new Block(EMPTY,WHITE));
		}
		this.interiorBoard.push(currentRow);
	}

	//Generate an array of random numbers and shuffle them
	var randomNumberArray = new Array();
	for (var i = 0; i < this.size * this.size; i++){
		randomNumberArray.push(i);
	}
	var shuffle = function (myArray) {
		for (i = myArray.length-1; i > 1  ; i--)
	    {
	        var r = Math.floor(Math.random()*i);
	        var t = myArray[i];
	        myArray[i] = myArray[r];
	        myArray[r] = t;
	    }

	    return myArray
	}
	randomNumberArray = shuffle(randomNumberArray);
	
	//Place two boxes colored the same in two different spots in the interior board, given from the random number array
	for(var i = 0; i < randomNumberArray.length; i +=2 )
	{
		var colorId = Math.floor((Math.random()*COLOR_ARRAY.length));
		
		var firstX = Math.floor(randomNumberArray[i]/this.size);
		var firstY = randomNumberArray[i] % this.size;

		var secondX = Math.floor(randomNumberArray[i + 1]/this.size);
		var secondY = randomNumberArray[i + 1] % this.size;

		this.interiorBoard[firstX][firstY] = new Block(colorId + 1, COLOR_ARRAY[colorId]);
		this.interiorBoard[secondX][secondY] = new Block(colorId + 1, COLOR_ARRAY[colorId]);
	}
	
}

Board.prototype.generateWholeBoard = function (){
	this.fullBoard = [];
	var coloredYCount = 0;
	
	for(var i = 0; i< GRID_SIZE; i++) {
		var currentRow = new Array();
		var coloredXCount = 0;
		for(var j = 0; j< GRID_SIZE; j++) {
			//If the counters are greater then the gridBorderSize(calculated in the constructor) and the count for both horizontal
			// and vertical are less than the size of the interior grid.
			if(j >= this.gridBorderSize && coloredXCount < this.size && coloredYCount < this.size && i >= this.gridBorderSize) {
				//Get the coorrespoding coordinates from the interior board
				var translatedX = i - this.size + (GRID_SIZE - 3 * this.gridBorderSize);
				var translatedY = j - this.size + (GRID_SIZE - 3 * this.gridBorderSize);
				//and push the box onto the row array
				currentRow.push(new Block(this.interiorBoard[translatedX][translatedY].id,this.interiorBoard[translatedX][translatedY].color));
				coloredXCount++;
			} else { // push empty block onto the row array
				currentRow.push(new Block(EMPTY, WHITE));
			}	
		}

 		if(i >= this.gridBorderSize  && coloredYCount < this.size) {
 			coloredYCount++;
 		}

		this.fullBoard[i] = currentRow;
	}
}

Board.prototype.isValidBox = function (x, y) {
	var boxX = Math.floor(x/SQUARE_LENGTH);
	var boxY = Math.floor(y/SQUARE_LENGTH);

	if ( this.fullBoard[boxX][boxY].id > EMPTY) {
		return true;
	}
	return false;
}

Board.prototype.compareBoxes = function (x,y, sx, sy) {
	var firstBoxX = Math.floor(x/SQUARE_LENGTH);
	var firstBoxY = Math.floor(y/SQUARE_LENGTH);
	var secondBoxX = Math.floor(sx/SQUARE_LENGTH);
	var secondBoxY = Math.floor(sy/SQUARE_LENGTH);

	//Check to see if they are the same box
	if(firstBoxX == secondBoxX && firstBoxY == secondBoxY) {
		return false;
	}
	//Check to see if they are the same color before checking to see if they are in "range" of each other
	if (this.fullBoard[firstBoxX][firstBoxY].id === this.fullBoard[secondBoxX][secondBoxY].id){
		
		//check to see if they are next to each other;
		if (Math.abs(firstBoxX - secondBoxX) <= 1 && Math.abs(firstBoxY - secondBoxY) == 0) //Horizontal Check
		{
			this.fullBoard[firstBoxX][firstBoxY] = new Block(EMPTY, WHITE);
			this.fullBoard[secondBoxX][secondBoxY] = new Block(EMPTY, WHITE);
			return true;
		} else if( Math.abs(firstBoxX - secondBoxX) == 0 && Math.abs(firstBoxY - secondBoxY) <= 1) { //Vertical Check
			this.fullBoard[firstBoxX][firstBoxY] = new Block(EMPTY, WHITE);
			this.fullBoard[secondBoxX][secondBoxY] = new Block(EMPTY, WHITE);
			return true;
		} else { //Check to see if we can draw a line between the two boxes with a maximum number of bends of 3

			var move = false;
			//check top
			if(firstBoxY - 1 >= 0 && this.fullBoard[firstBoxX][firstBoxY-1].id == EMPTY){
				move = this.validMove(firstBoxX,firstBoxY - 1,secondBoxX,secondBoxY,1,MOVE_TOP);
			}
			//check right			
			if(!move && firstBoxX + 1 < GRID_SIZE && this.fullBoard[firstBoxX + 1][firstBoxY].id == EMPTY){
				move = move = this.validMove(firstBoxX + 1,firstBoxY,secondBoxX,secondBoxY,1,MOVE_RIGHT);
			}
			//check bottom
			if(!move && firstBoxY + 1 < GRID_SIZE && this.fullBoard[firstBoxX][firstBoxY + 1].id == EMPTY){
				move = this.validMove(firstBoxX,firstBoxY + 1,secondBoxX,secondBoxY,1,MOVE_BOTTOM);
			}
			//check left
			if(!move && firstBoxX - 1 >= 0 && this.fullBoard[firstBoxX - 1][firstBoxY].id == EMPTY){
				move = this.validMove(firstBoxX - 1,firstBoxY,secondBoxX,secondBoxY,1,MOVE_LEFT);
			}
			//If their is a valid line between the two boxes, replace them with empty boxes
			if(move === true){
				this.fullBoard[firstBoxX][firstBoxY] = new Block(EMPTY, WHITE);
				this.fullBoard[secondBoxX][secondBoxY] = new Block(EMPTY, WHITE);
			}

			return move;
		}
	}
	return false;
}

//Checks to see if the board is empty
Board.prototype.empty = function() {
	for(var i = 0; i < GRID_SIZE; i++) {
		for(var j = 0; j<GRID_SIZE; j++) {
			if(this.fullBoard[i][j].id !== EMPTY) {
				return false;
			}
		}	
	}
	return true;
}