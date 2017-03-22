function enemyA(){
//variable
    var instance = this; //instance
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
    this.allowLazer = false;
    
    this.side = 1; //which side player facing left:-1 right:1
    this.seq = 0;
    this.count = 0;
    
    this.hp=10;
    
    this.loadImage = function(){
        instance.image[0]= new Image();
        instance.image[0].src="./image/enemyA/stand.png";
        instance.image[1]= new Image();
        instance.image[1].src="./image/enemyA/walking.png";
        instance.image[2]= new Image();
        instance.image[2].src="./image/enemyA/attackA.png";
        instance.image[3]= new Image();
        instance.image[3].src="./image/enemyA/attackB.png";
        instance.image[5]= new Image();
        instance.image[5].src="./image/enemyA/jump.png";
        
        instance.imageFrame[0]=4;
        instance.imageFrame[1]=4;
        instance.imageFrame[2]=3;
        instance.imageFrame[3]=3;
        instance.imageFrame[5]=1;
    }
    
    //update player information, ref:MainGameFunctions:gameStart()
    this.update = function(){
        instance.newPos();
        instance.bulletPos();
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
    
        
        if(instance.hp<=1 && instance.lifetimes<2){
            instance.heal();            
            instance.lifetimes++;
        }
            
        if (instance.count<60) {
            instance.walk(1);
        }else if (instance.count<100) {
            instance.stop();
        }else if (instance.count<150) {
            instance.walk(-1);
        }else{
            instance.shootBullet();
        }
        
        if (enemy.hp<8 && instance.count==80) {
            instance.allowLazer = true;
        }
        
        instance.lazer();
        
        if(checkWall(instance)){
           instance.jump();
        }
        
        
        for(var i = 0;i < player.bullet.length;i++){
            if(player.bullet[i]){
                if(player.bullet[i].y > instance.y && player.bullet[i].y < instance.y+instance.height){
                       instance.jump();
             }
           }
        }
        
        if(instance.count > 210){
         instance.count = 0;
        }
    }
    
    this.heal = function()
    {
     instance.ActionStatus = 3;
     instance.actionDelay = 39;
     instance.hp = 10;   
    }
    
    this.lazer = function(){
        if (!instance.lazers[0] && instance.allowLazer) {
            instance.speedX=0;
            instance.ActionStatus = 2;
            instance.actionDelay = 70;
            for (var i = 0 ; i < 8 ; i++) {
                instance.lazers[i] = {x:100+i*150,y:0,width:20,height:600};
            }
            instance.allowLazer = false;
        }
        
        if (instance.actionDelay<20) {
            for (var i = 0 ; i < 8 ; i++) {
                if (instance.lazers[0])
                    checkAttackPlayer(instance.lazers[i]);
            }
        }
        
        if (instance.actionDelay==0) {
            for (var i = 0 ; i < 8 ; i++) {
                if (instance.lazers[0])
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
            instance.actionDelay = 15;
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
                    instance.bullet[Math.floor(instance.bulletCount/instance.bulletSpeed)]=new bullet(instance.x+instance.width/2,instance.y+instance.height/2,instance.side,1);
            }
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
    
    this.drawLazer = function(){
        for(var i = 0;i<8;i++){
            ctx.save();
            if(instance.actionDelay < 20){
                ctx.fillStyle="red";
            }else{
                ctx.fillStyle="yellow";
            }
            ctx.fillRect(instance.lazers[i].x,instance.lazers[i].y,instance.lazers[i].width,instance.lazers[i].height);
            ctx.restore();
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
        
        if (instance.lazers[0]) {
            instance.drawLazer();
        }
            
        ctx.save();
        ctx.scale(instance.side, 1);
        ctx.drawImage(instance.image[instance.ActionStatus],90*Math.floor((instance.seq/10)),0,this.width,this.height,instance.side*instance.x-instance.opposite_side_correction,instance.y,this.width,this.height);
        ctx.restore();
        instance.seq++;
        }
        instance.drawBullet();
    }
}
