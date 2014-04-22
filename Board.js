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
	console.log(randomNumberArray);

	for(var i = 0; i < randomNumberArray.length; i +=2 )
	{
		var colorId = Math.floor((Math.random()*COLOR_ARRAY.length) + 1);
		
		var firstX = Math.floor(randomNumberArray[i]/this.size);
		var firstY = randomNumberArray[i] % this.size;

		var secondX = Math.floor(randomNumberArray[i + 1]/this.size);
		var secondY = randomNumberArray[i + 1] % this.size;

		this.interiorBoard[firstX][firstY] = new Block(colorId, COLOR_ARRAY[colorId]);
		this.interiorBoard[secondX][secondY] = new Block(colorId, COLOR_ARRAY[colorId]);
	}

	console.log(this.interiorBoard);
	/*
	for(var i = 0; i < this.size * this.size / 2; i++) {
		var firstNotColored = true;
		var firstX = Math.floor((Math.random()*this.size) );
		var firstY = Math.floor((Math.random()*this.size) );

		var secondNotColored = true;
		var secondX = Math.floor((Math.random()*this.size) );
		var secondY = Math.floor((Math.random()*this.size) );

		var colorId = Math.floor((Math.random()*COLOR_ARRAY) + 1);


		console.log(firstX);
		console.log(firstY);
		console.log(this.interiorBoard[firstX][firstY]);


		while(firstNotColored) 
		{
			if (this.interiorBoard[firstX][firstY].id === EMPTY) {
				this.interiorBoard[firstX][firstY] = new Block(colorId, COLOR_ARRAY[colorId]);
				fisrtNotColored = false;
			} else {
				var firstX = Math.floor((Math.random()*this.size) );
				var firstY = Math.floor((Math.random()*this.size) );
			}
		}

		while(secondNotColored) 
		{
			if (this.interiorBoard[secondX][secondY].id === EMPTY) {
				this.interiorBoard[secondX][secondY] = new Block(colorId, COLOR_ARRAY[colorId]);
				secondNotColored = false;
			} else {
				var secondX = Math.floor((Math.random()*this.size) );
				var secondY = Math.floor((Math.random()*this.size) );
			}
		}

	}*/
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
				console.log(gridBorderSize + " " + i);
				console.log(i - this.size + (GRID_SIZE - 3 * gridBorderSize));

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
