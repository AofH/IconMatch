function Timer(x,y,width,height,timeLength){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.storedWidth = width;
	this.timeLength = timeLength;
	this.timerMilliseconds = timeLength * 1000;
	this.timerColor = YELLOW;
	this.timeRemaining = this.timeLength;


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

	if(this.width < 0 ){
		this.width = 0;
	}

	//Update the timer by 1 second;
	if (now - this.lastTimerUpdateTime > 1000) {
	  this.timeRemaining--;
      this.lastTimerUpdateTime = now;
    }
}