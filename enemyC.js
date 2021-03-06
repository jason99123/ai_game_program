function enemyC(){
//variable
    var instance = this; //instance
	var whirlwind_audio = new Audio("./sound/whirlwind.ogg");
	var charge_audio = new Audio("./sound/charge.ogg");
    this.name="Dixon" // enemy name
    this.gravitySpeed = 0; //drop speed
    this.gravity = 0.25; //drop acceleration
    this.speedY = 0; //Y acceleration
    this.speedX = 0; //X acceleration
    this.x = 500; //x location
    this.y = 400; //y location
    this.width = 90; //image width
    this.height = 104; //image height
    this.opposite_side_correction = 0; //correct coordination when flipping
    
    
    this.maxSpeed = 20; // player maxium walking speed
    this.walkingSpeed = 9; //player walking speed
    this.onGround = false; //check player is on ground
    this.jumpDistance = 10; //player jump distance
    this.ActionStatus = 0; //player action status for animation 0:stop 1:walking 2:Charge 3:melee 4:Whirlwind 5:jump
    
    
    this.image = new Array();
    this.imageFrame = new Array();
    this.animationRate = 13; //how fast the player animation change
	
	this.actionDelay = 0;
    this.show=true; // show enemy.image
	
    this.whirlwind = new Array();
	this.allowWhirlwind = 0;//0:cant use 1:can use
	this.WhirlwindDelay = 0;

	this.charge = new Array();
	this.allowCharge = 0;
	this.ChargeDelay = 0;
    
    this.side = 1; //which side player facing left:-1 right:1
    this.seq = 0; 
    this.count = 0;
	
    this.hp=10;
    this.damageDelay = 0; // delay for next damage
    
    this.loadImage = function(){
        instance.image[0]= new Image();
        instance.image[0].src="./image/enemyC/stand.png";
        instance.image[1]= new Image();
        instance.image[1].src="./image/enemyC/walking.png";
        instance.image[2]= new Image();
        instance.image[2].src="./image/enemyC/attackA.png";
        instance.image[3]= new Image();
        instance.image[3].src="./image/enemyC/attackB.png";
        instance.image[4]= new Image();
        instance.image[4].src="./image/enemyC/attackC.png";
        instance.image[5]= new Image();
        instance.image[5].src="./image/enemyC/jump.png";
        instance.image[6]= new Image();
        instance.image[6].src="./image/enemyC/fire.png";
        
        instance.imageFrame[0]=3;
        instance.imageFrame[1]=4;
        instance.imageFrame[2]=3;
        instance.imageFrame[3]=3;
        instance.imageFrame[4]=4;
        instance.imageFrame[5]=1;
    }
    
    //update player information, ref:MainGameFunctions:gameStart()
    this.update = function(){
        instance.newPos();
		instance.chargeFinish();
		instance.whirlwindFinsh();
        instance.damageDelay--;
	
    }
	
	//update player position, ref:player:update()

    this.newPos = function(){
		this.randomAction();
        gravityMove(instance);
        walking(instance);
        checkOnGround(instance);
    }
	
		
	this.randomAction = function(){
	this.diffX = player.x - instance.x;
	this.diffY = player.y - instance.y;
	this.random = Math.random()*100;

	//jump when sticking on a wall
        if(checkWall(instance)){
           instance.actionDelay = 0;
           instance.jump();
        }
		
		if(this.diffY<-50){
			instance.actionDelay=0;
			instance.jump();
			if(this.diffX > 0){
  	        instance.actionDelay = 0;
            instance.side=1;
            instance.walk(1);
            instance.actionDelay = 50;
		}
		else if(this.diffX < 0){   
		instance.actionDelay = 0;
            instance.side=-1;
            instance.walk(-1);
            instance.actionDelay = 50;
		}
		
		}
		else if(player.y>instance.y ){
			if((this.diffY<-30 ||this.diffY>30)){
			if (this.diffX> 0){
            instance.side=1;
            instance.walk(1);
			}
			}
			else if (this.diffX> 0){
            instance.side=1;
            instance.walk(1);
			}
			else if(this.diffX< 0){
            instance.side=-1;
            instance.walk(-1);
			}
			
		}
		else if(this.diffY == 0){
			this.random = Math.random()*100;
			if(this.diffX>-10 && this.diffX<10 && this.random>50){
				if(instance.walkingSpeed<15){
				instance.allowWhirlwind=1;
                instance.ActionStatus = 4;
                instance.actionDelay = 10;
				instance.shootwhirlwind();}
				else if(instance.walkingSpeed==15){
				instance.allowCharge=1;
                //instance.ActionStatus = 2;
                instance.actionDelay = 10;
				instance.useCharge();
				}
				this.random = Math.random()*100;
			}else if(this.diffX>-40 && this.diffX<40){
				instance.stop();
                if (!instance.delay()) {
				this.melee = new function(){
				this.x=instance.x-10;
				this.y=instance.y;
				this.width=60;
				this.height=100;
				}				
				checkAttackPlayer(this.melee);
				delete this.melee;
				instance.ActionStatus=3;
				this.random = Math.random()*100;
                instance.actionDelay = 10;
                }
			}
			else if (this.diffX> 0){
			if(instance.hp<5){
				instance.walkingSpeed=15;
			}
			else
				instance.walkingSpeed=9;
            instance.side=1;
            instance.walk(1);
		
			}
			else if(this.diffX< 0){
				if(this.hp<5){
				instance.walkingSpeed=15;
			}
			else
				instance.walkingSpeed=9;
            instance.side=-1;
            instance.walk(-1);
			}

		}


		instance.WhirlwindDelay--;
		instance.ChargeDelay--;
       
	}
    
	this.checkPlayerSide = function(){ //check player is on which side of enemy
        if (instance.x > player.x) { //player is left side of enemy
            return -1;
        } else {
            return 1;
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
			if(instance.walkingSpeed==15){
				instance.ActionStatus =2;
			}
			else
            instance.ActionStatus = 1;
            instance.side=side;
            instance.speedX=instance.walkingSpeed*side;
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
	
	this.shootwhirlwind = function(){
			if(!instance.whirlwind[0] && instance.allowWhirlwind != 0){
				instance.speedX=0;
                
				instance.WhirlwindDelay=40;
				instance.actionDelay=40;
				instance.whirlwind[0] = {x:instance.x,y:instance.y-48,width:120,height:150};
				
				whirlwind_audio.play();
				instance.allowWhirlwind=0;
		}
	}
	
	this.useCharge = function(){
		if(!instance.charge[0] && instance.allowCharge!=0){
			instance.ChargeDelay=40;
			instance.actionDelay=10;
			instance.charge[0] = {x:instance.x-10,y:instance.y,width:60,height:100};
			
			charge_audio.play();
			instance.allowCharge=0;
		}
	}
	
	this.chargeFinish = function(){
		if(instance.ChargeDelay<20){
			if(instance.charge[0])
				checkAttackPlayer(instance.charge[0]);
		}
		if(instance.ChargeDelay==0){
			if(instance.charge[0])
				delete instance.charge[0];
		}
	}
	
	this.whirlwindFinsh = function(){
		if(instance.WhirlwindDelay<20){
			if(instance.whirlwind[0])
				checkAttackPlayer(instance.whirlwind[0]);
		}
		if(instance.WhirlwindDelay==0){
			if(instance.whirlwind[0])
				delete instance.whirlwind[0];
		}
	}
	

	
	this.Charge = function(){
				this.x=instance.x-10;
				this.y=instance.y;
				this.width=60;
				this.height=100;

	}
	
    
	this.drawWhirlwind = function(){
		if(instance.whirlwind[0]){
			ctx.save();
			ctx.beginPath();
			 if(instance.WhirlwindDelay < 10){
                    ctx.shadowBlur=10;
                    ctx.shadowColor="red";
                    ctx.globalAlpha = 0.1/(1);
                    ctx.fillStyle="red";
                    ctx.fillRect(0,0,width,height);
                    ctx.globalAlpha = 0.8;
                    ctx.fillStyle="red";
                    ctx.drawImage(instance.image[6],0,instance.whirlwind[0].height*2,instance.whirlwind[0].width,instance.whirlwind[0].height,instance.whirlwind[0].x,instance.whirlwind[0].y,instance.whirlwind[0].width,instance.whirlwind[0].height);
                }else if(instance.WhirlwindDelay < 20){
                    ctx.shadowBlur=10;
                    ctx.shadowColor="yellow";
                    ctx.globalAlpha = 0.05/(1);
                    ctx.fillStyle="red";
                    ctx.drawImage(instance.image[6],0,instance.whirlwind[0].height,instance.whirlwind[0].width,instance.whirlwind[0].height,instance.whirlwind[0].x,instance.whirlwind[0].y,instance.whirlwind[0].width,instance.whirlwind[0].height);

                }else{
                    ctx.shadowBlur=10;
                    ctx.shadowColor="yellow";
                    ctx.globalAlpha = 0.025;
                    ctx.fillStyle="red";
                    ctx.fillRect(0,0,width,height);
                    ctx.globalAlpha = 0.5;
                    ctx.drawImage(instance.image[6],0,0,instance.whirlwind[0].width,instance.whirlwind[0].height,instance.whirlwind[0].x,instance.whirlwind[0].y,instance.whirlwind[0].width,instance.whirlwind[0].height);
            }
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
        
        ctx.save();
        ctx.shadowBlur=5;
        ctx.shadowColor="#FF4000";
        ctx.scale(instance.side, 1);
        ctx.drawImage(instance.image[instance.ActionStatus],90*Math.floor((instance.seq/10)),0,this.width,this.height,instance.side*instance.x-instance.opposite_side_correction,instance.y,this.width,this.height);
        ctx.restore();
        
        instance.seq++;
        }
        if (instance.whirlwind[0]) {
            instance.drawWhirlwind();
        }
        
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.fillStyle="red";
        ctx.fillRect(0,0,width,height);
        ctx.restore();
    }

}
