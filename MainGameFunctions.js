//global variable
var player;
var enemy;
var canvas;
var ctx;
var update_interval = 17; //frame update rate
var height = 600; //canvas height
var width = 1000; //canvas width
var obstacleList = new Array();
var background = new Image();

//initiation of game
function init(){
    //init canvas
    canvas = document.getElementById("game");
    ctx=canvas.getContext && canvas.getContext('2d');
    
    
    //start game initiation when ctx is ready
    if (ctx) {
        //gameObject initiation
        background.src="./image/background.jpg";
        
        player = new character();
        player.loadImage();
        
        enemy = new enemyA(); //create enemy object A/B/C
        enemy.loadImage();
        
        loadBulletImage();
        
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
        if (player.hp<=0 || enemy.hp<=0) {
            gameover();
        }else{
        ctx.clearRect(0, 0, width, height);
        
        //draw background 
        ctx.drawImage(background,0,-300);
        
        drawObstacle();
        
        player.draw();
        enemy.draw();
        drawHP();
        }
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

function checkAttackEnemy(object){ //check if attack sucess to enemy
    if (object.x>=enemy.x && object.x<=enemy.x+enemy.width && object.y>=enemy.y && object.y<=enemy.y+enemy.height) {
        enemy.hp-=1;
        enemy.show=false;
        return true
    }else{
        return false;
    }
}

function checkAttackPlayer(object){ //check if attack sucess to enemy
    var hit = false;
    for(var i = object.x;i<object.x+object.width;i++){
        for(var j = object.y;j<object.y+object.height;j++){
            if (i>=player.x && i<=player.x+player.width && j>=player.y && j<=player.y+player.height) {
                hit = true;
            }
        }
    }
    
    if (hit && player.damageDelay<=0) {
        if (player.ActionStatus != 4) {
            player.hp-=1;
            player.damageDelay = 10;
        }
        player.show=false;
        return true
    }else{
        return false;
    }
}

function drawHP(){
    ctx.save();
    ctx.fillStyle="#0489B1";
    ctx.fillRect(66,82.5,150,40);
    ctx.strokeStyle="#08298A";
    ctx.strokeRect(66,82.5,150,40);
    ctx.fillStyle="#08298A";
    ctx.fillRect(65,41,20,43);
    ctx.fillStyle="black";
    ctx.fillRect(85,42.5,290,40);
    ctx.fillStyle="#D7DF01";
    ctx.fillRect(95,50,player.hp*27,25);
    ctx.fillStyle="black";
    for(var i=0;i<10;i++){
        ctx.fillRect(95+i*27,50,4,25);
    }
    ctx.strokeStyle="#08298A";
    ctx.strokeRect(85,42.5,290,40);
    ctx.drawImage(player.image[0],20,20,50,40,66,82,50,40)
    ctx.strokeRect(66.5,82.5,50,40);
    ctx.font="20px Arial";
    ctx.fillText("Player",130,110);
    ctx.restore();
    
    ctx.save();
    ctx.fillStyle="#FE2E2E";
    ctx.fillRect(773,82.5,150,40);
    ctx.strokeStyle="#8A0808";
    ctx.strokeRect(773,82.5,150,40);
    ctx.fillStyle="#8A0808";
    ctx.fillRect(905,41,20,43);
    ctx.fillStyle="black";
    ctx.fillRect(615,42.5,290,40);
    ctx.fillStyle="#D7DF01";
    ctx.fillRect(895,50,-enemy.hp*27,25);
    ctx.fillStyle="black";
    for(var i=0;i<10;i++){
        ctx.fillRect(625+i*27,50,4,25);
    }
    ctx.strokeStyle="#8A0808";
    ctx.strokeRect(615,42.5,290,40);
    ctx.drawImage(player.image[0],20,20,50,40,66,82,50,40)
    ctx.strokeRect(873.5,82.5,50,40);
    ctx.font="20px Arial";
    ctx.fillText("Enemy",790,110);
    ctx.restore();
}

function gameover(){
        ctx.fillStyle="black";
        ctx.fillRect(0,0,width,height);
        ctx.fillStyle="white";
        ctx.font="100px Arial";
        if (enemy.hp<=0) {
            ctx.fillText("you win!",300,250);
        }else{
        ctx.fillText("you die...",300,250);
        }
        ctx.fillRect(405,350,180,50);
        ctx.fillStyle="black";
        ctx.font="20px Arial";
        ctx.fillText("Click R to restart",422.5,382.5);
        window.addEventListener('keydown',restart,false);
}

function restart(e) {
        if (e.keyCode == 82) {
        location.reload();
    }
}
