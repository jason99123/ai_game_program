function enemyB(){
//variable
    var instance = this; //instance
    var heal_audio = new Audio("./sound/heal.ogg");
    var laser_audio = new Audio("./sound/laser.ogg");
    var bullet_audio = new Audio("./sound/gun2.mp3");
    this.name="Fireman" // enemy name
    this.gravitySpeed = 0; //drop speed
    this.gravity = 0.25; //drop acceleration
    this.speedY = 0; //Y acceleration
    this.speedX = 0; //X acceleration
    this.x = 500; //x location
    this.y = 0; //y location
    this.width = 90; //image width
    this.height = 104; //image height
    this.opposite_side_correction = 0; //correct coordination when flipping
    
    this.maxSpeed = 10; // player maxium walking speed
    this.walkingSpeed = 5; //player walking speed
    this.onGround = false; //check player is on ground
    this.jumpDistance = 10; //player jump distance
    this.ActionStatus = 0; //player action status for animation 0:stop 1:walking 2:attackA 3:attackB 4:defense 5:jump
    
    
    this.image = new Array();
    this.imageFrame = new Array();
    this.animationRate = 13; //how fast the character animation change
    this.actionDelay = 0;
    this.show=true; // show enemy.image
    
    this.bullet = new Array();
    this.maxBullet = 3;
    this.bulletCount = 0;
    this.skillCount = 0;
    this.bulletSpeed = 30;
    this.lifetimes = 0;
    
    this.lazers = new Array();
    this.allowLazer = 0; //0:cant use 1:all screen lazer 2:character-chasing
    this.lazerDelay = 0;
    
    this.side = 1; //which side player facing left:-1 right:1
    this.seq = 0;
    this.count = 0;
    
    this.hp=10;
    this.damageDelay = 0; // delay for next damage
    
    this.loadImage = function(){
        instance.image[0]= new Image();
        instance.image[0].src="./image/enemyB/stand.png";
        instance.image[1]= new Image();
        instance.image[1].src="./image/enemyB/walking.png";
        instance.image[2]= new Image();
        instance.image[2].src="./image/enemyB/attackA.png";
        instance.image[3]= new Image();
        instance.image[3].src="./image/enemyB/attackB.png";
        instance.image[4]= new Image();
        instance.image[4].src="./image/enemyB/attackC.png";
        instance.image[5]= new Image();
        instance.image[5].src="./image/enemyB/jump.png";
        instance.image[100]= new Image();
        instance.image[100].src="./image/enemyB/talkingBubble.png";
        
        instance.imageFrame[0]=4;
        instance.imageFrame[1]=4;
        instance.imageFrame[2]=3;
        instance.imageFrame[3]=3;
        instance.imageFrame[4]=3;
        instance.imageFrame[5]=1;
    }
    
    //update player information, ref:MainGameFunctions:gameStart()
    this.update = function(){
        instance.newPos();
        instance.bulletPos();
        instance.lazer();
        
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
        
        if (instance.count == 80) {
            if (instance.hp >5) {
            instance.actionDelay = 0;
            instance.allowLazer = 2;
            instance.shootLazer();
            }else{
            instance.actionDelay = 0;
            instance.allowLazer = 1;
            instance.shootLazer();
            }
        }else if (Math.abs(instance.x-player.x)>300) {
            this.random = Math.random()*100;
            if (this.random < 70) {
                instance.shootBullet();
            }else if (this.random <100) {
                instance.walk(instance.side);
                instance.actionDelay=10;
            }
        }
        
        if ((Math.abs(instance.x-player.x)<500)) {
            instance.walk(-instance.checkPlayerSide());
        }else if (Math.abs(instance.x-player.x)<50) {
            instance.actionDelay = 0;
            instance.allowLazer = 2;
            instance.shootLazer();
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
        
        //heal when not enough hp (twice)
        if(instance.hp<=1 && instance.lifetimes<2){
            instance.actionDelay = 0;
            instance.heal();            
            instance.lifetimes++;
        }
        
        if (instance.count == 300) {
            instance.count = 0;
        }
        instance.lazerDelay--;
    }
    
    this.heal = function()
    {
     instance.ActionStatus = 3;
     instance.actionDelay = 39;
     instance.hp = 6;  
     heal_audio.play(); 
    }
    
    this.shootLazer = function(){
       if (!instance.delay()) {
            if (!instance.lazers[0] && instance.allowLazer != 0) {
            instance.speedX=0;
            instance.ActionStatus = 4;
            
        if(instance.allowLazer==1){
            for (var i = 0 ; i < 8 ; i++) {
                instance.lazerDelay = 40;
                instance.actionDelay = 40;
                instance.lazers[i] = {x:Math.random()*100+i*150,y:0,width:15,height:600};
            }
        }else if (instance.allowLazer==2) {
                instance.lazerDelay = 40;
                instance.actionDelay = 40;
                instance.lazers[0] = {x:player.x,y:0,width:90,height:600};
        }
            instance.allowLazer = 0;
	    laser_audio.play();
            }
       }
    }
    
    this.lazer = function(){        
        if (instance.lazerDelay<20) {
            for (var i = 0 ; i < 8 ; i++) {
                if (instance.lazers[i])
                    checkAttackPlayer(instance.lazers[i]);
            }
        }
        
        if (instance.lazerDelay==0) {
            for (var i = 0 ; i < 8 ; i++) {
                if (instance.lazers[i])
                    delete instance.lazers[i];
                }
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
        if (instance.actionDelay>0) {
            instance.actionDelay--;
            return true;
        }else{
        return false;
        }
    }
    
    this.shootBullet = function(){
        if (!instance.delay()) {
            instance.ActionStatus = 2;
            instance.speedX = 0;
            instance.side = instance.checkPlayerSide();
            if (!instance.bullet[Math.floor(instance.bulletCount/instance.bulletSpeed)]) {
                    instance.bullet[Math.floor(instance.bulletCount/instance.bulletSpeed)]=new bullet(instance.x+instance.width/2,instance.y+instance.height/2,instance.side,10,1);
            }
            instance.bulletCount++;
            bullet_audio.play();    
            if (Math.floor(instance.bulletCount/instance.bulletSpeed) >= instance.maxBullet) {
                instance.bulletCount = 0;
            }
            instance.actionDelay = 5;
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
                instance.bullet[i].newPos();
            if (checkWall(instance.bullet[i]) || checkAttackPlayer(instance.bullet[i]) ) {
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
    
    this.talk = function(){
        ctx.save();
        ctx.shadowBlur=5;
        ctx.shadowColor="Black";
        ctx.drawImage(instance.image[100],instance.x,instance.y-100,150,100);
        ctx.font='15px "Press Start 2P"';
        if (instance.ActionStatus == 4) {
            ctx.fillText("Fire!",instance.x+30,instance.y-55);
        }else{
            ctx.fillText("Heal!",instance.x+30,instance.y-55);
        }
        ctx.restore();
    }
    
    this.drawLazer = function(){
        for(var i = 0;i<8;i++){
            if (instance.lazers[i]) {
                ctx.save();
                if(instance.lazerDelay < 10){
                    ctx.shadowBlur=10;
                    ctx.shadowColor="red";
                    ctx.globalAlpha = 0.1/(i+1);
                    ctx.fillStyle="red";
                    ctx.fillRect(0,0,width,height);
                    ctx.globalAlpha = 0.8;
                    ctx.fillStyle="red";
                    ctx.fillRect(instance.lazers[i].x,instance.lazers[i].y,instance.lazers[i].width,instance.lazers[i].height);
                    ctx.globalAlpha = 0.3;
                    ctx.fillStyle="yellow";
                    ctx.fillRect(instance.lazers[i].x+instance.lazers[i].width/10,instance.lazers[i].y,instance.lazers[i].width/10*8,instance.lazers[i].height);
                    ctx.globalAlpha = 0.3;
                    ctx.fillStyle="white";
                    ctx.fillRect(instance.lazers[i].x+instance.lazers[i].width/3,instance.lazers[i].y,instance.lazers[i].width/3,instance.lazers[i].height);
                    ctx.globalAlpha = 0.8;
                    ctx.fillStyle="white";
                    ctx.fillRect(instance.lazers[i].x+instance.lazers[i].width/5*2,instance.lazers[i].y,instance.lazers[i].width/5,instance.lazers[i].height);

                }else if(instance.lazerDelay < 20){
                    ctx.shadowBlur=10;
                    ctx.shadowColor="yellow";
                    ctx.globalAlpha = 0.05/(i+1);
                    ctx.fillStyle="red";
                    ctx.fillRect(0,0,width,height);
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle="yellow";
                    ctx.fillRect(instance.lazers[i].x-15,instance.lazers[i].y,instance.lazers[i].width+30,instance.lazers[i].height);
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle="orange";
                    ctx.fillRect(instance.lazers[i].x,instance.lazers[i].y,instance.lazers[i].width,instance.lazers[i].height);
                }else{
                    ctx.shadowBlur=10;
                    ctx.shadowColor="yellow";
                    ctx.globalAlpha = 0.025/(i+1);
                    ctx.fillStyle="red";
                    ctx.fillRect(0,0,width,height);
                    ctx.globalAlpha = 0.3;
                    ctx.fillStyle="#F2F5A9";
                    ctx.fillRect(instance.lazers[i].x-25,instance.lazers[i].y,instance.lazers[i].width+50,instance.lazers[i].height);
            }
            ctx.restore();
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
            instance.opposite_side_correction=90; 
        }else{
            instance.opposite_side_correction=0; 
        }
        
        ctx.save();
        ctx.shadowBlur=5;
        ctx.shadowColor="#FF4000";
        ctx.scale(instance.side, 1);
        ctx.drawImage(instance.image[instance.ActionStatus],90*Math.floor((instance.seq/10)),0,this.width,this.height,instance.side*instance.x-instance.opposite_side_correction,instance.y,this.width,this.height);
        ctx.restore();
        
        if (instance.ActionStatus == 4 || instance.ActionStatus == 3) {
            instance.talk();
        }
        
        instance.seq++;
        }
        instance.drawBullet();

        if (instance.lazers[0]) {
            instance.drawLazer();
        }
    }

}
