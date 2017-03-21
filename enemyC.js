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
    this.animationRate = 13; //how fast the character animation change
    
    
    this.side = 1; //which side player facing left:-1 right:1
    this.seq = 0; 
    
    this.hp=10;
    
    this.loadImage = function(){
        //null now
    }
    
    //update player information, ref:MainGameFunctions:gameStart()
    this.update = function(){
        instance.newPos();
    }
    
    //update player position, ref:character:update()
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