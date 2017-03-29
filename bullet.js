var bulletImage = new Array();
function loadBulletImage(){
    bulletImage[0] = new Image();
    bulletImage[0].src = "./image/bullet/bulletA.png";
    bulletImage[1] = new Image();
    bulletImage[1].src = "./image/bullet/bulletB.png";
    
}

function bullet(x,y,side,speedX,type){
    var instance=this;
    this.x=x;
    this.y=y;
    this.tmpY=y;
    this.tmpX=x;
    this.speedX = speedX;
    this.side=side;
    this.width=30;
    this.height=30;
    this.seq=0;
    this.animationRate = 13;
    
    //circle Movement module
    this.circleX = 0;
    this.circleY = 0;
    this.angle = 0;
    
    this.newPos = function(){
        instance.tmpX += instance.speedX*instance.side;
        instance.x = instance.tmpX + instance.circleX;
        instance.y = instance.tmpY+instance.circleY;
    }
    
    this.circleMovement = function(radius,angle){
        var correction = 0;
        if (radius>0) {
            correction = 40;
        }
        
        this.radius = radius;
        instance.circleX = Math.cos(instance.angle*3) * this.radius;
        instance.circleY = Math.sin(instance.angle) * this.radius-correction;
        this.angle += angle;
    }
    
    this.draw = function(){
        if (instance.seq>3*instance.animationRate) {
            instance.seq = 0;
        }
        
        ctx.save();
        
        ctx.shadowBlur=20;
        if (type == 0) {
            ctx.shadowColor="white";
        }else if(type == 1) {
            ctx.shadowColor="red";
        }
        
        ctx.scale(instance.side, 1);
        ctx.drawImage(bulletImage[type],this.width*Math.floor((instance.seq/10)),0,this.width,this.height,instance.side*instance.x,this.y,this.width,this.height);
        ctx.restore();
        
        instance.seq++;
    }
}
