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
var chosenEnemy //enemy chosen : A/B/C

var countdown = true;
var count = 4;

//initiation of game
function init(){
    //init canvas
    canvas = document.getElementById("game");
    ctx=canvas.getContext && canvas.getContext('2d');
    
    chosenEnemy = prompt("input enemy type (temp)");
    
    //start game initiation when ctx is ready
    if (ctx) {
        //gameObject initiation
        loadBackground();
        
        player = new character();
        player.loadImage();
        
        switch(chosenEnemy){
        case "A":
        enemy = new enemyA(); //create enemy object A
        break;
        case "B":
        enemy = new enemyB(); //create enemy object A
        break;
        case "C":
        enemy = new enemyC(); //create enemy object A
        break;
	case "D":
	enemy = new enemyD(); 
	break;
        }
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
    
    if (count <= 0) {
    player.update();
    enemy.update();
    }
    draw();
    
    if (count<=3 && count >=0) {
        countDown();
    }
    
    setTimeout(gameStart,update_interval);
    count--;

 }

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function countDown() { //provide count down for loading iamge
        var str=".";
        ctx.save();
        ctx.font='100px "Press Start 2P"';
        ctx.fillStyle="white";
        if (count > 0) {
            ctx.fillText(count,450,300);
            ctx.font='10px "Press Start 2P"';
            ctx.fillText("Loading"+str.repeat(count),800,30);
        }else if (count == 0) {
            ctx.fillText("start!",250,300);
        }
        ctx.restore();
        sleep(1000);
}

//draw : update game visual output  
 function draw(){
        // Check game end
        if (player.hp<=0 || enemy.hp<=0) {
            gameover();
        }else{
            
        //clear rectangle
        ctx.clearRect(0, 0, width, height);
        
        //draw background 
        drawBackground();
        
        //draw obstacles
        drawObstacle();
        
        player.draw();
        enemy.draw();
        
        drawHP();
        }
}

 function initObstacle(){
    switch(chosenEnemy){
    case "A":
    obstacleList[0] = new obstacle(0,575,1000,25,"black","#0B2161","#B43104");
    break;
    case "B":
    obstacleList[0] = new obstacle(0,350,400,25,"#AEB404","#8A4B08","#B43104");
    obstacleList[1] = new obstacle(0,575,1000,25,"#AEB404","#8A4B08","#B43104");
    obstacleList[2] = new obstacle(600,400,300,25,"#AEB404","#8A4B08","#B43104");
    obstacleList[3] = new obstacle(200,150,200,25,"#AEB404","#8A4B08","#B43104");
    obstacleList[4] = new obstacle(800,200,100,25,"#AEB404","#8A4B08","#B43104");
    break;
    case "C":
    obstacleList[0] = new obstacle(0,350,400,25,"#AEB404","#8A4B08","#B43104");
    obstacleList[1] = new obstacle(0,575,1000,25,"#AEB404","#8A4B08","#B43104");
    obstacleList[2] = new obstacle(600,400,300,25,"#AEB404","#8A4B08","#B43104");
    obstacleList[3] = new obstacle(200,150,200,25,"#AEB404","#8A4B08","#B43104");
    obstacleList[4] = new obstacle(800,200,100,25,"#AEB404","#8A4B08","#B43104");
    break;
    case "D":
    obstacleList[0] = new obstacle(0,575,1000,25,"black","#0B2161","#B43104");
    break;
    }
 }

 //load Background
 function loadBackground(){
        switch(chosenEnemy){
        case "A":
        background.src="./image/backgroundA.png";
        break;
        case "B":
        background.src="./image/backgroundB.jpg";
        break;
        case "C":
        background.src="./image/backgroundA.png";
        break;
        case "D":
	background.src="./image/backgroundA.png";
	break;
    }
 }
 
 function drawBackground(){
    switch(chosenEnemy){
        case "A":
        ctx.drawImage(background,0,100);
        break;
        case "B":
        ctx.drawImage(background,0,-300);
        break;
        case "C":
        ctx.drawImage(background,0,100);
        break;
	case "D":
	ctx.drawImage(background,0,100);
	break;
    }
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
            object.y=obstacleList[i].y-object.height;
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
    
    var hit = false;
    for(var i = object.x;i<object.x+object.width;i++){
        for(var j = object.y;j<object.y+object.height;j++){
            if (i>=enemy.x && i<=enemy.x+enemy.width && j>=enemy.y && j<=enemy.y+enemy.height) {
                hit = true;
            }
        }
    }
    
    if (hit && enemy.damageDelay<=0) {
        enemy.hp-=1;
        enemy.show=false;
        enemy.damageDelay = 10;
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
            player.hp-=0.5;
        }else if (player.ActionStatus == 4) {
            player.hp-=0.1;
        }
        player.damageDelay = 10;
        player.show=false;
        return true;
    }else{
        return false;
    }
}

function drawHP(){
    ctx.save();
    ctx.shadowBlur=10;
    ctx.shadowColor="Black";
    ctx.fillStyle="#0489B1";
    ctx.fillRect(66,82.5,150,40);
    ctx.strokeStyle="#08298A";
    ctx.strokeRect(66,82.5,150,40);
    ctx.fillStyle="#08298A";
    ctx.fillRect(65,41,20,43);
    ctx.fillStyle="black";
    ctx.fillRect(85,42.5,290,40);
    
    if (player.hp>8) {
        ctx.fillStyle="#00FF00";
    }else if(player.hp>5){
        ctx.fillStyle="#D7DF01";
    }else{
        ctx.fillStyle="red";
    }
    ctx.fillRect(95,50,player.hp*27,25);
    ctx.fillStyle="black";
    for(var i=0;i<10;i++){
        ctx.fillRect(95+i*27,50,4,25);
    }
    ctx.strokeStyle="#08298A";
    ctx.strokeRect(85,42.5,290,40);
    ctx.drawImage(player.image[0],20,20,50,40,66,82,50,40)
    ctx.strokeRect(66.5,82.5,50,40);
    ctx.font='13px "Press Start 2P"';
    ctx.fillText("Player",130,110);
    ctx.restore();
    
    ctx.save();
    ctx.shadowBlur=10;
    ctx.shadowColor="Black";
    ctx.fillStyle="#FE2E2E";
    ctx.fillRect(773,82.5,150,40);
    ctx.strokeStyle="#8A0808";
    ctx.strokeRect(773,82.5,150,40);
    ctx.fillStyle="#8A0808";
    ctx.fillRect(905,41,20,43);
    ctx.fillStyle="black";
    ctx.fillRect(615,42.5,290,40);
    ctx.fillStyle="#D7DF01";
    if (enemy.hp>8) {
        ctx.fillStyle="#00FF00";
    }else if(enemy.hp>5){
        ctx.fillStyle="#D7DF01";
    }else{
        ctx.fillStyle="red";
    }
    ctx.fillRect(895,50,-enemy.hp*27,25);
    ctx.fillStyle="black";
    for(var i=0;i<10;i++){
        ctx.fillRect(625+i*27,50,4,25);
    }
    ctx.strokeStyle="#8A0808";
    ctx.strokeRect(615,42.5,290,40);
    ctx.save();
    ctx.scale(-1,1);
    ctx.drawImage(enemy.image[0],20,20,50,40,-923,83,50,40);
    ctx.restore();
    ctx.strokeRect(873.5,82.5,50,40);
    ctx.font='13px "Press Start 2P"';
    ctx.fillText(enemy.name,780,110);
    ctx.restore();
}

function gameover(){
        ctx.fillStyle="black";
        ctx.fillRect(0,0,width,height);
        ctx.fillStyle="white";
        ctx.font="100px Arial";
        if (enemy.hp<=0) {
            if (player.hp==10) {
            ctx.fillText("No damage!",230,250);
            }else{
            ctx.fillText("you win!",300,250);
            }
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
