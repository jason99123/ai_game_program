function enemyA(){
//variable
    var instance = this; //instance
    this.name="Gunman" // enemy name
    this.gravitySpeed = 0; //drop speed
    this.gravity = 0.25; //drop acceleration
    this.speedY = 0; //Y acceleration
    this.speedX = 0; //X acceleration
    this.x = 800; //x location
    this.y = 400; //y location
    this.width = 90; //image width
    this.height = 104; //image height
    this.opposite_side_correction = 0; //correct coordination when flipping
    
    this.maxSpeed = 20; // player maxium walking speed
    this.walkingSpeed = 20; //player walking speed
    this.onGround = false; //check player is on ground
    this.jumpDistance = 13; //player jump distance
    this.ActionStatus = 0; //player action status for animation 0:stop 1:walking 2:attackA 3:attackB 4:defense 5:jump
    
    
    this.image = new Array();
    this.imageFrame = new Array();
    this.animationRate = 13; //how fast the character animation change
    this.actionDelay = 0;
    this.show=true; // show enemy.image
    
    this.bullet = new Array();
    this.maxBullet = 5;
    this.bulletCount = 0;
    this.skillCount = 0;
    this.bulletSpeed = 30;
    this.lifetimes = 0;
    
    this.side = 1; //which side player facing left:-1 right:1
    this.seq = 0;
    this.count = 0;
    
    this.hp=10;
    this.damageDelay = 0; // delay for next damage
    this.bulletType = 0; // bullet type 0:normal type 1:jumping type
    
    this.loadImage = function(){
        instance.image[0]= new Image();
        instance.image[0].src="./image/enemyA/stand.png";
        instance.image[1]= new Image();
        instance.image[1].src="./image/enemyA/walking.png";
        instance.image[2]= new Image();
        instance.image[2].src="./image/enemyA/attackA.png";
        instance.image[5]= new Image();
        instance.image[5].src="./image/enemyA/jump.png";
        
        instance.image[100]= new Image();
        instance.image[100].src="./image/enemyB/talkingBubble.png";
        
        instance.imageFrame[0]=2;
        instance.imageFrame[1]=2;
        instance.imageFrame[2]=3;
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
        this.randomAction();
        gravityMove(instance);
        walking(instance);
        checkOnGround(instance);
    }
    
    this.randomAction = function(){ //test random action
        instance.count++;
        
        //jump when sticking on a wall
        if(checkWall(instance)){
           instance.actionDelay = 0;
           instance.jump();
        }
        

        if (Math.abs(instance.x-player.x)>=400) {
            this.random = Math.random()*100;
            if (this.random < 80) {
                instance.actionDelay=0;
                instance.shootBullet();
            }else if (this.random <100) {
                instance.walk(instance.side);
                instance.actionDelay=10;
            }
        }else if ((Math.abs(instance.x-player.x)<400)) {
            instance.walk(-instance.checkPlayerSide());
        }else{
            instance.stop();  
        }
        
        if (instance.count == 30) {
           instance.jump();
        }
        
        if (instance.x>=800) { //rebound when too close to right
            instance.actionDelay = 0;
            instance.side=-1;
            instance.walk(-1);
            instance.actionDelay = 50;
        }else if (instance.x<=200) { //rebound when too close to left
            instance.actionDelay = 0;
            instance.side=1;
            instance.walk(1);
            instance.actionDelay = 50;
        }
        

        // jump when player shoot
        for(var i = 0;i < player.bullet.length;i++){
            if(player.bullet[i]){
                if(player.bullet[i].y > instance.y && player.bullet[i].y < instance.y+instance.height){
                        instance.actionDelay = 0;
                       instance.jump();
             }
           }
        }
        
        if (instance.count < 20) {
            instance.talk();
        }
        
        if (instance.count == 300) {
            instance.count = 0;
            
            for(var i=0;i<instance.bullet.length;i++){    
            if (instance.bullet[i]) {
            delete instance.bullet[i];
                }
            }
            instance.bulletType = Math.floor(Math.random()*4);
        }
    }
    
    this.stop = function(){
        if (!instance.delay()) {
            instance.speedX=0;
            instance.ActionStatus = 0;
        }
    }
    
    this.walk = function(side){
        if (!instance.delay()) {
            instance.ActionStatus = 1;
            instance.side=side;
            instance.speedX=6*side;
        }
    }
    
    this.jump = function(){
    if (!instance.delay()) {
         if (instance.onGround) {
            instance.onGround = false;
            instance.ActionStatus = 5;
            instance.actionDelay = 10;
            instance.gravitySpeed = -instance.jumpDistance;
         }
       }
    }
    
    this.delay = function(){
        if (instance.actionDelay > 0) {
            instance.actionDelay--;
            return true;
        }else{
        return false;
        }
    }
    
    this.shootBullet = function(){
        if (!instance.delay()) {
            if (!instance.bullet[Math.floor(instance.bulletCount/instance.bulletSpeed)]) {
                    instance.ActionStatus = 2;
                    instance.speedX = 0;
                    instance.side = instance.checkPlayerSide();
                    instance.bullet[Math.floor(instance.bulletCount/instance.bulletSpeed)]=new bullet(instance.x+instance.width/2,instance.y+instance.height/2,instance.side,2+Math.random()*6,2);
            }
            instance.actionDelay=15;
            instance.bulletCount++;
                
            if (Math.floor(instance.bulletCount/instance.bulletSpeed) >= instance.maxBullet) {
                instance.bulletCount = 0;
            }
        }
    }
    
    this.checkPlayerSide = function(){ //check player is on which side of enemy
        if (instance.x > player.x) { //player is left side of enemy
            return -1;
        } else {
            return 1;
        }
    }
    
    this.bulletPos = function(){
        for(var i=0;i<instance.bullet.length;i++){    
            if (instance.bullet[i]) {
                
                switch(instance.bulletType){
                case 0:
                instance.bullet[i].circleMovement(0,0);
                instance.bullet[i].newPos();
                break;
                case 1:
                instance.bullet[i].circleMovement(60,0.05);
                instance.bullet[i].newPos();
                break;
                case 2:
                instance.bullet[i].circleMovement(10,0.2);
                instance.bullet[i].newPos();
                break;
                case 3:
                instance.bullet[i].circleMovement(40,0.1);
                instance.bullet[i].newPos();
                break;
                }
                
                
            if (checkWall(instance.bullet[i]) || checkAttackPlayer(instance.bullet[i]) ) {
                delete instance.bullet[i];
                }
            }
        }
    }
    
    this.talk = function(){
        ctx.save();
        ctx.shadowBlur=5;
        ctx.shadowColor="Black";
        ctx.drawImage(instance.image[100],instance.x,instance.y-100,150,100);
        ctx.font='15px "Press Start 2P"';
        
        switch(instance.bulletType){
                case 0:
                ctx.fillText("Type#A.",instance.x+20,instance.y-60);
                break;
                case 1:
                ctx.fillText("Type#B.",instance.x+20,instance.y-60);
                break;
                case 2:
                ctx.fillText("Type#C.",instance.x+20,instance.y-60);
                break;
                case 3:
                ctx.fillText("Type#D.",instance.x+20,instance.y-60);
                break;
        }

        ctx.restore();
    }
    
    this.drawBullet = function(){
        for(var i=0;i<instance.bullet.length;i++){    
            if (instance.bullet[i]) {
                instance.bullet[i].draw();
            }
        }
    }
    
    this.ModeCountDown = function (){
        if ((300-instance.count) < 3 ) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle="red";
            ctx.fillRect(0,0,width,height);
            ctx.restore();
        }
        
        if ((300-instance.count) > 280 ) {
        ctx.save();
        ctx.font='30px "Press Start 2P"';
        ctx.shadowBlur=8;
        ctx.fillStyle="red";
        ctx.shadowColor="red";
        ctx.fillText("FIRE COMING",335,250);
        ctx.restore();
        }
        
        ctx.save();
        ctx.shadowBlur=5;
        if ((300-instance.count) > 50) {
            ctx.fillStyle="white";
            ctx.shadowColor="white";
        }else{
            ctx.fillStyle="red";
            ctx.shadowColor="red";
        }

        ctx.font='30px "Press Start 2P"';
        ctx.fillText("Danger:"+(300-instance.count),350,150);
        ctx.restore();
    }
    
        //draw player, ref:MainGameFunctions:draw()
    this.draw = function(){
        
        instance.ModeCountDown();
        
        if (!instance.show) {
            instance.show = true;
        }else{
        
        var opposite_side_correction; //need correction x coordinate when flipping image,flipping image will cause x coordinate error
        if (instance.seq>(instance.imageFrame[instance.ActionStatus]-1)*instance.animationRate) {
            instance.seq = 0;
        }
        
        
        if(instance.side==-1){
            instance.opposite_side_correction=90; 
        }else{
            instance.opposite_side_correction=0; 
        }
        
        ctx.save();
        ctx.shadowBlur=5;
        ctx.shadowColor="#41DCBF";
        ctx.scale(instance.side, 1);
        ctx.drawImage(instance.image[instance.ActionStatus],90*Math.floor((instance.seq/10)),0,this.width,this.height,instance.side*instance.x-instance.opposite_side_correction,instance.y,this.width,this.height);
        ctx.restore();
        
        instance.seq++;
        }
        
        if (instance.count < 30) {
            instance.talk();
        }
        
        instance.drawBullet();

    }

}
