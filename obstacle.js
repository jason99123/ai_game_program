function obstacle(x,y,width,height,fillcolor,strokecolor,shadowcolor){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    
    this.draw = function(){
        ctx.save();
        ctx.shadowBlur=3;
        ctx.shadowColor= shadowcolor;
        ctx.fillStyle = fillcolor;
        ctx.fillRect(x,y,width,height);
        
        ctx.strokeStyle = strokecolor;
        ctx.lineWidth   = 3;
        ctx.strokeRect(x,y,width,height);
        ctx.restore();
    }
}