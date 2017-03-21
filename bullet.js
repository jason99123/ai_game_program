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
    
    this.newPos = function(){
        instance.x+=instance.speedX*instance.side;
    }
    
    this.draw = function(){
        ctx.drawImage(bulletImage[type],this.x,this.y,this.width,this.height);
    }
}
