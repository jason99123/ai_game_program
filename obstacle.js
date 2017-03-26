function obstacle(x,y,width,height){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    
    this.draw = function(){
        ctx.save();
        ctx.shadowBlur=3;
        ctx.shadowColor="#B43104";
        ctx.fillStyle = "#AEB404";
        ctx.fillRect(x,y,width,height);
        
        ctx.strokeStyle = "#8A4B08";
        ctx.lineWidth   = 3;
        ctx.strokeRect(x,y,width,height);
        ctx.restore();
    }
}