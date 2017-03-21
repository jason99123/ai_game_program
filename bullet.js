function bullet(x,y,side,color){
    var instance=this;
    this.x=x;
    this.y=y;
    this.side=side;
    this.width=10;
    this.height=10;
    this.speedX = 10;
    
    this.newPos = function(){
        instance.x+=instance.speedX*instance.side;
    }
    
    this.draw = function(){
        ctx.fillStyle=color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}
