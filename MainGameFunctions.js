//global variable
var player;
var enemy;
var ctx;
var update_interval = 17; //frame update rate
var height = 600; //canvas height
var width = 1000; //canvas width
var obstacleList = new Array();
var background = new Image();

//initiation of game
function init(){
    //init canvas
    var canvas = document.getElementById("game");
    ctx=canvas.getContext && canvas.getContext('2d');
    
    
    //start game initiation when ctx is ready
    if (ctx) {
        //gameObject initiation
        background.src="./image/background.jpg";
        
        player = new character();
        player.loadImage();
        
        enemy = new enemyA(); //create enemy object A/B/C
        
        initObstacle();
        
        //Player Control inintiation
        window.addEventListener('keydown',player.playerAction,false);
        window.addEventListener('keyup',player.stopWalking,false);
        
        //game start
        gameStart();
    }
}

//gamestart : call all update function
 function gameStart(){
    player.update();
    enemy.update();
    draw();
    setTimeout(gameStart,update_interval);
 }
    
//draw : update game visual output  
 function draw(){
        // Clear the canvas
        ctx.clearRect(0, 0, width, height);
        
        //draw background 
        ctx.drawImage(background,0,-300);
        
        drawObstacle();
        
        player.draw();
        enemy.draw();
        
}

 function initObstacle(){
    obstacleList[0] = new obstacle(0,450,400,25);
    obstacleList[1] = new obstacle(0,575,1000,25);
    obstacleList[2] = new obstacle(600,400,300,25);
    obstacleList[3] = new obstacle(0,200,200,25);
    obstacleList[4] = new obstacle(800,300,100,25);

 }

 function drawObstacle(){
    for(var i=0;i<obstacleList.length;i++){
        obstacleList[i].draw();
    }
 }

//gravityMove : gravity Engine
 function gravityMove(object) {
        object.gravitySpeed += object.gravity;
        if (!object.onGround) {
                object.y += object.speedY + object.gravitySpeed;
        }
    }
    
//walking : walking Engine
 function walking(object) {
        if (!checkWall(object)) {
            object.x += object.speedX;

        }
    }
        
function checkWall(object){ //check if colliding on wall
        var nextStep=object.x+object.speedX;
        if (nextStep<=0-50 || nextStep>=width-object.width+50) {
            return true;
        }else{
            for (var i=0;i<obstacleList.length;i++) {
            if (object.x+object.width/2+10>=obstacleList[i].x && object.x+object.width/2-10<=obstacleList[i].x+obstacleList[i].width && object.y+object.height-15>=obstacleList[i].y && object.y+10<=obstacleList[i].y+obstacleList[i].height) {
                    return true;
                }
            }
        return false;
        }
    }

function checkOnGround(object){ //check player is on ground (not yet fully implemented)
    //if condition => on ground
    var match = false;
    if (object.gravitySpeed>0) {
        for (var i=0;i<obstacleList.length;i++) {
            if (match == false && object.y>=obstacleList[i].y-110 && object.y<=obstacleList[i].y+obstacleList[i].height && object.x+object.width/2+10>=obstacleList[i].x && object.x+object.width/2-10<=obstacleList[i].x+obstacleList[i].width) {
            match = true;
            object.onGround = true;
            object.gravity = 0;
            }
        }
    if(!match){
            object.onGround = false;
            object.gravity = 0.25;
        }
    }else{
        object.gravity = 0.25;     
    }

}