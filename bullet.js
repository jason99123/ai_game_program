var bulletImage = new Array();
function loadBulletImage(){
    bulletImage[0] = new Image();
    bulletImage[0].src = "./image/bullet/bulletA.png";
    bulletImage[1] = new Image();
    bulletImage[1].src = "./image/bullet/bulletB.png";
    
}

function bullet(x,y,side,type){
    var instance=this;
    this.x=x;
    this.y=y;
    this.side=side;
    this.width=30;
    this.height=30;
    this.speedX = 10;
    this.seq=0;
    this.animationRate = 13;
    
    this.newPos = function(){
        instance.x+=instance.speedX*instance.side;
    }
    
    this.draw = function(){
        if (instance.seq>3*instance.animationRate) {
            instance.seq = 0;
        }
        
        ctx.save();
        ctx.scale(instance.side, 1);
        ctx.drawImage(bulletImage[type],this.width*Math.floor((instance.seq/10)),0,this.width,this.height,instance.side*instance.x,this.y,this.width,this.height);
        ctx.restore();
        instance.seq++;
    }
}
