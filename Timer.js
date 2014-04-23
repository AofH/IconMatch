function Timer(x,y,width,height,timeLength){
	this.x = x;
	this.y = y;
	this.width = width;
	this.storedWidth = width;
	this.height = height;
	this.timeLength = timeLength*2;
	this.timerColor = YELLOW;
	this.timeRemaining = this.timeLength;

	this.pixelsChangePerSecond = this.width/(this.timeLength);

	this.lastAnimationFrameTime = 0;
	this.lastFpsUpdateTime = 0;
}

Timer.prototype.update = function(now){
	var fps = 1000/(now - this.lastAnimationFrameTime);
	var difference = now - this.lastAnimationFrameTime;
	this.lastAnimationFrameTime = now;
	
	if (now - this.lastFpsUpdateTime > 500) {
	  this.timeRemaining--;
      this.lastFpsUpdateTime = now;
      this.width -= this.pixelsChangePerSecond;	  
      this.count++;
    }
   	return fps; 
}