function obstacle(x,y,width,height){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    
    this.draw = function(){
        ctx.fillStyle = "#AEB404";
        ctx.fillRect(x,y,width,height);
        
        ctx.strokeStyle = "#61210B";
        ctx.lineWidth   = 3;
        ctx.strokeRect(x,y,width,height);
    }
}