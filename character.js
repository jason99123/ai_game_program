function character(){
//variable
    var instance = this; //instance
    this.gravitySpeed = 0; //drop speed
    this.gravity = 0.25; //drop acceleration
    this.speedY = 0; //Y acceleration
    this.speedX = 0; //X acceleration
    this.x = 0; //x location
    this.y = 0; //y location
    this.width = 150;
    this.height = 100;
    this.maxSpeed = 10; // player maxium walking speed
    this.walkingSpeed = 5; //player walking speed
    this.jumpDistance = 10; //player jump distance
    this.ActionStatus = 0; //player action status for animation 0:stop 1:walking 2:attackA 3:attackB 4:defense 5:jump
    this.image = new Array();
    this.imageFrame = new Array();
    this.animationRate = 13; //how fast the character animation change
    this.seq = 0; 
    
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
    }
    
    //update player position, ref:character:update()
    this.newPos = function(){
        gravityMove(instance);
        walking(instance);
    }
    
    //player action by player input, ref:MainGameFunctions:init()
    this.playerAction = function(e){
        switch(e.keyCode){
            case 37: //left button
                instance.ActionStatus = 1;
                if (instance.speedX > -instance.maxSpeed) {
                    instance.speedX -= instance.walkingSpeed;
                }
                break;
            case 38: //up button
                    instance.ActionStatus = 5;
                    instance.gravitySpeed = -instance.jumpDistance;
                break;
            case 39: //right button
                instance.ActionStatus = 1;
                
                if (instance.speedX < instance.maxSpeed) {
                    instance.speedX += instance.walkingSpeed;
                }
                break;
            case 40: //down button
                break;
            case 65: //A button
                instance.ActionStatus = 2;
                break;
            case 68: //d button
                instance.ActionStatus = 4;
                break;
            case 83: //s button
                instance.ActionStatus = 3;
                break;
        }
    }
    
    //stop walking when no key is inputted, ref:MainGameFunctions:init()
    this.stopWalking = function(e){
                instance.speedX = 0;
                instance.ActionStatus = 0;
    }
    
        //draw player, ref:MainGameFunctions:draw()
    this.draw = function(){
        if (instance.seq>(instance.imageFrame[instance.ActionStatus]-1)*instance.animationRate) {
            instance.seq = 0;
        }
        ctx.drawImage(instance.image[instance.ActionStatus],90*Math.floor((instance.seq/10)),0,90,104,instance.x,instance.y,90,104);
        instance.seq++;
        ctx.fillText(instance.x,100,100);
        ctx.fillText(instance.y,200,100);
        ctx.fillText(instance.seq,300,100);
    }
}