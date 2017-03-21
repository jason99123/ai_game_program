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
    this.lifetimes = 0;
    
    
    this.maxSpeed = 10; // player maxium walking speed
    this.walkingSpeed = 5; //player walking speed
    this.onGround = false; //check player is on ground
    this.jumpDistance = 10; //player jump distance
    this.ActionStatus = 0; //player action status for animation 0:stop 1:walking 2:attackA 3:attackB 4:defense 5:jump
    
    
    this.image = new Array();
    this.imageFrame = new Array();
    this.animationRate = 13; //how fast the character animation change
    this.show=true; // show enemy.image
    this.skillCount = 0;
    
    this.side = 1; //which side player facing left:-1 right:1
    this.seq = 0;
    this.count = 0;
    
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
        this.randomAction();
        gravityMove(instance);
        walking(instance);
        checkOnGround(instance);
    }
    
    this.randomAction = function(){ //test random action
        instance.count++;
    
        
        if(instance.hp<=1 && instance.lifetimes<5){
            instance.heal();            
            instance.lifetimes++;
        }
            
        if (instance.count<50) {
            instance.side=1;
            instance.ActionStatus = 1;
            instance.speedX=3;
        }else{
            instance.side=-1;
            instance.ActionStatus = 1;
            instance.speedX=-3;
        }
        
        if (instance.count>=100) {
            if (instance.onGround) {
            instance.onGround = false;
            instance.gravitySpeed = -instance.jumpDistance;
            instance.count = 0;
            }
        }
    }
    
    this.heal = function()
    {
     instance.skillCount = 50;
     instance.hp = 10;   
    }
    
    this.drawSkillAction = function(){
            ctx.save();
            ctx.fillStyle="black";
            ctx.font="30px Arial";
            ctx.fillText("Heal!",instance.x,instance.y-50);
            instance.skillCount--;
            ctx.restore();
        
            ctx.save();
            ctx.scale(instance.side, 1);
            ctx.fillStyle="blue";
            ctx.fillRect(instance.side*instance.x-opposite_side_correction,instance.y,this.width,this.height);
            ctx.fillStyle="black";
            ctx.font="30px Arial";
            ctx.fillText("Dickson",instance.side*instance.x-opposite_side_correction,instance.y+50);
            ctx.restore();
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
            
        if(instance.skillCount > 0){
            instance.drawSkillAction();
        }else{
            ctx.save();
            ctx.scale(instance.side, 1);
            ctx.fillStyle="red";
            ctx.fillRect(instance.side*instance.x-opposite_side_correction,instance.y,this.width,this.height);
            ctx.fillStyle="black";
            ctx.font="30px Arial";
            ctx.fillText("Dickson",instance.side*instance.x-opposite_side_correction,instance.y+50);
            ctx.restore();
         }
      }
    }
}
