function Timer(x,y,width,height,timeLength){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.storedWidth = width;
	this.timeLength = timeLength;
	this.timerColor = YELLOW;
	this.timeRemaining = this.timeLength;
	this.tempWidth = 0;

	this.lastAnimationFrameTime = 0;
	this.lastTimerUpdateTime = 0;
}

Timer.prototype.update = function(now){
	var fps = 1000 / (now - this.lastAnimationFrameTime);
    this.lastAnimationFrameTime = now;
    
    var pixelsChangePerFrame = this.storedWidth / (this.timeLength*fps);

	//Sometimes the pixelsChangePerFrame is not a number so we set it to 0;
	if (isNaN(pixelsChangePerFrame)){
		pixelsChangePerFrame = 0;
	}

	this.width -= pixelsChangePerFrame;
	//If the width ever goes below 0, it continues drawing so this prevents it from doing so
	if(this.width < 0 ){
		this.width = 0;
	}

	//Update the timer by 1 second;
	if (now - this.lastTimerUpdateTime > 1000) {
	  this.timeRemaining--;
      this.lastTimerUpdateTime = now;
    }
}

Timer.prototype.addTime = function(addedTime) {
	this.timeRemaining += addedTime;
	var pixelsChangePerSecond = this.storedWidth/this.timeLength;
	this.width += (pixelsChangePerSecond * addedTime);
}

Timer.prototype.timePassed = function() {
	return this.timeLength - this.timeRemaining;
}