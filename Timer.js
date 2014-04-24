function Timer(x,y,width,height,timeLength){
	this.x = x;
	this.y = y;
	this.width = width;
	//this.storedWidth = width;
	this.height = height;
	this.timeLength = timeLength;
	this.timerColor = YELLOW;
	this.timeRemaining = this.timeLength;

	this.pixelsChangePerMilliSecond = this.width/(this.timeLength*1000);

	this.lastAnimationFrameTime = 0;
	this.lastFpsUpdateTime = 0;
}

Timer.prototype.update = function(now){
	
	//var fps = 1000/(now - this.lastAnimationFrameTime);
	
	var difference = now - this.lastAnimationFrameTime;


	if(this.pixelsChangePerMilliSecond * difference > 1)
	{
		this.lastAnimationFrameTime = now;
		this.width -= (this.pixelsChangePerMilliSecond * difference);
		//prevent the width from going below 0 and displaying wierdly
		if (this.width < 0) {
			this.width = 0;
		}
	}
	//Update the timer by 1 second;
	if (now - this.lastFpsUpdateTime > 1000) {
	  this.timeRemaining--;
      this.lastFpsUpdateTime = now;
    }
   	//return fps; 
}