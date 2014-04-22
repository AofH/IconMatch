function Board(size){
	this.size = size;
	this.interiorBoard = new Array();
	this.fullBoard = new Array();
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
	var gridBorderSize = ((GRID_SIZE - this.size) / 2);
	for(var i = 0; i< GRID_SIZE; i++) {
		var currentRow = new Array();
		var coloredXCount = 0;
		for(var j = 0; j< GRID_SIZE; j++) {

			if(j >= gridBorderSize && coloredXCount < this.size && coloredYCount < this.size && i >= gridBorderSize) {
				
				var translatedX = i - this.size + (GRID_SIZE - 3 * gridBorderSize);
				var translatedY = j - this.size + (GRID_SIZE - 3 * gridBorderSize);

				currentRow.push(new Block(this.interiorBoard[translatedX][translatedY].id,this.interiorBoard[translatedX][translatedY].color));
				coloredXCount++;
			} else {
				currentRow.push(new Block(0, WHITE));
			}	
		}

 		if(i >= gridBorderSize  && coloredYCount < this.size) {
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

	if (this.fullBoard[firstBoxX][firstBoxY].id === this.fullBoard[secondBoxX][secondBoxY].id){
		console.log("Both boxes are the same color");


		this.fullBoard[firstBoxX][firstBoxY] = new Block(EMPTY, WHITE);
		this.fullBoard[secondBoxX][secondBoxY] = new Block(EMPTY, WHITE);
		return true;

	}

	return false;


}