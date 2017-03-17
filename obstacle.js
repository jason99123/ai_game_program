function obstacle(x,y,width,height){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    
    this.draw = function(){
        ctx.fillStyle = "black";
        ctx.fillRect(x,y,width,height);
    }
}