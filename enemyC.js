function enemyC(){
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
    
    
    
    this.maxSpeed = 10; // player maxium walking speed
    this.walkingSpeed = 5; //player walking speed
    this.onGround = false; //check player is on ground
    this.jumpDistance = 10; //player jump distance
    this.ActionStatus = 0; //player action status for animation 0:stop 1:walking 2:attackA 3:attackB 4:defense 5:jump
    
    
    this.image = new Array();
    this.imageFrame = new Array();
    this.animationRate = 13; //how fast the player animation change
    this.whirlwind = new Array();
    
    this.side = 1; //which side player facing left:-1 right:1
    this.seq = 0; 
    
    this.hp=10;
    
    this.loadImage = function(){
        //null now
    }
    
    //update player information, ref:MainGameFunctions:gameStart()
    this.update = function(){
        instance.newPos();
		instance.bulletPos();
        instance.lazer();
        
        instance.damageDelay--;
    }
	
	this.enemyAction = function(){
		//get the player position

		
		//close to player
		if(instance.x>player.x ){
			instance.side = instance.checkPlayerSide();
            instance.walk(side);
			instance.actionDelay = 10;
		} else if (instance.x<player.x){
			instance.side = instance.checkPlayerSide();
            instance.walk(side);
            instance.actionDelay = 10;
		}
		
		if(instance.x-player.x>=0 && instance.x-player.x<=5 || player.x-instance.x>=0 && player.x-instance.x<=5){
			nstance.ActionStatus = 1;
			instance.side = instance.checkPlayerSide();
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
		
		if(instance.y-player.y>20||player.y-instance.y>20){
			instance.actionDelay = 0;
			instance.jump();
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
	
	this.shootwhirlwind = function(){
		if()
	}
	
	this.Charge = function(side){
			instance.ActionStatus = 2;
			instance.side = instance.checkPlayerSide();
            instance.side=side;tance.speedX = 100;

	}
	
    //update player position, ref:player:update()
    this.newPos = function(){
        gravityMove(instance);
        walking(instance);
        checkOnGround(instance);
    }
    
        //draw player, ref:MainGameFunctions:draw()
    this.draw = function(){
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
        ctx.scale(instance.side, 1);
        ctx.fillStyle="yellow";
        ctx.fillRect(instance.side*instance.x-opposite_side_correction,instance.y,this.width,this.height);
        ctx.restore();
        instance.seq++;
    }
}