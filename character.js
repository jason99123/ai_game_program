function character(){
//variable
    var instance = this; //instance
    this.gravitySpeed = 0; //drop speed
    this.gravity = 0.5; //drop acceleration
    this.speedY = 0; //Y acceleration
    this.speedX = 0; //X acceleration
    this.x = 0; //x location
    this.y = 400; //y location
    this.width = 90; //image width
    this.height = 104; //image height
    
    this.maxSpeed = 10; // player maxium walking speed
    this.walkingSpeed = 10; //player walking speed
    this.onGround = false; //check player is on ground
    this.jumpDistance = 10; //player jump distance
    this.ActionStatus = 0; //player action status for animation 0:stop 1:walking 2:attackA 3:attackB 4:defense 5:jump
    
    this.image = new Array();
    this.imageFrame = new Array();
    this.animationRate = 13; //how fast the character animation change
    
    this.side = 1; //which side player facing left:-1 right:1
    this.seq = 0; 
        
    this.bullet = new Array();
    this.maxBullet = 5;
    this.bulletCount = 0;
    this.show=true;
    
    this.hp=10;
    this.damageDelay = 0; // delay for next damage
        
    this.loadImage = function(){
        instance.image[0]= new Image();
        instance.image[0].src="./image/character/stand.png";
        instance.image[1]= new Image();
        instance.image[1].src="./image/character/walking.png";
        instance.image[2]= new Image();
        instance.image[2].src="./image/character/attackA.png";
        instance.image[3]= new Image();
        instance.image[3].src="./image/character/attackB.png";
        instance.image[4]= new Image();
        instance.image[4].src="./image/character/defense.png";
        instance.image[5]= new Image();
        instance.image[5].src="./image/character/jump.png";
        
        instance.imageFrame[0]=2;
        instance.imageFrame[1]=4;
        instance.imageFrame[2]=2;
        instance.imageFrame[3]=2;
        instance.imageFrame[4]=1;
        instance.imageFrame[5]=1;
    }
    
    //update player information, ref:MainGameFunctions:gameStart()
    this.update = function(){
        instance.newPos();
        instance.bulletPos();
        
        instance.damageDelay--;
    }
    
    //update player position, ref:character:update()
    this.newPos = function(){
        gravityMove(instance);
        walking(instance);
        checkOnGround(instance);
        
        if (checkWall(instance)) {
            instance.onGround = false;
            instance.gravitySpeed = -5;
        }
    }
    
    //player action by player input, ref:MainGameFunctions:init()
    this.playerAction = function(e){
        switch(e.keyCode){
            case 37: //left button
                instance.side=-1;
                instance.ActionStatus = 1;
                if (instance.speedX > -instance.maxSpeed) {
                    instance.speedX -= instance.walkingSpeed;
                }
                break;
            case 38: //up button
                    if (instance.onGround) { // check if player is onground in order to jump
                        instance.onGround = false;
                        instance.ActionStatus = 5;
                        instance.gravitySpeed = -instance.jumpDistance;
                    }
                break;
            case 39: //right button
                instance.side=1;
                instance.ActionStatus = 1;
                
                if (instance.speedX < instance.maxSpeed) {
                    instance.speedX += instance.walkingSpeed;
                }
                break;
            case 40: //down button
                break;
            case 65: //A button
                instance.ActionStatus = 2;
                if (!instance.bullet[instance.bulletCount]) {
                    instance.bullet[instance.bulletCount]=new bullet(instance.x+instance.width/2,instance.y+instance.height/2,instance.side,0);
                }
                instance.bulletCount++;
                
                if (instance.bulletCount >= instance.maxBullet) {
                    instance.bulletCount = 0;
                }
                
                break;
            case 68: //d button
                instance.ActionStatus = 4;
                break;
            case 83: //s button
                this.melee = new function(){
                    this.x=instance.x+instance.width/2+instance.width*instance.side-30;
                    this.y=instance.y;
                    this.width = 60;
                    this.height = 100;
                }
                checkAttackEnemy(melee);
                delete this.melee;
                instance.ActionStatus = 3;
                break;
        }
    }
    
    //stop walking when no key is inputted, ref:MainGameFunctions:init()
    this.stopWalking = function(e){
                instance.speedX = 0;
                instance.ActionStatus = 0;
    }
    
    this.bulletPos = function(){
        for(var i=0;i<instance.bullet.length;i++){    
            if (instance.bullet[i]) {
                instance.bullet[i].newPos();
            if (checkWall(instance.bullet[i]) || checkAttackEnemy(instance.bullet[i]) ) {
                delete instance.bullet[i];
                }
            }
        }
    }
    
    this.drawBullet = function(){
        for(var i=0;i<instance.bullet.length;i++){    
            if (instance.bullet[i]) {
                instance.bullet[i].draw();
            }
        }
    }
    
        //draw player, ref:MainGameFunctions:draw()
    this.draw = function(){
        
        if (!instance.show) {
            instance.show = true;
        }else{
            var opposite_side_correction; //need correction x coordinate when flipping image,flipping image will cause x coordinate error
            if (instance.seq>(instance.imageFrame[instance.ActionStatus]-1)*instance.animationRate) {
                instance.seq = 0;
            }
        
            
            if(instance.side==-1){
                opposite_side_correction=90; 
            }else{
                opposite_side_correction=0; 
            }
            
        
            ctx.save();
            ctx.shadowBlur=3;
            ctx.shadowColor="#DF7401";
            ctx.scale(instance.side, 1);
            ctx.drawImage(instance.image[instance.ActionStatus],90*Math.floor((instance.seq/10)),0,this.width,this.height,instance.side*instance.x-opposite_side_correction,instance.y,this.width,this.height);
            ctx.restore();
            instance.seq++;
        }
        //temp usage : showing coordiate only    
        //ctx.fillStyle = "black";
        //ctx.fillText("X:"+instance.x,100,20);
        //ctx.fillText("Y:"+instance.y,200,20);
        //ctx.fillText("delay:"+player.damageDelay,300,20);
        //ctx.fillText("enemyLazerDelay:"+enemy.actionDelay,450,20);
        
        instance.drawBullet();
    }
}
