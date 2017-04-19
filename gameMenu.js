
///////////////Variables for menu/////////////////
var enemyAIcon = new Image();
var enemyBIcon = new Image();
var enemyCIcon = new Image();
var menuBackground = new Image();
var click_sound = new Audio("./sound/click_sound.mp3");
var timeout;

///////////////End of Variables for menu/////////////////

//////////////Start of function for menu//////////////////////
function drawMenuBackground(){
    ctx.save();
    ctx.drawImage(menuBackground,0,0,1000,600,0,0,1000,600);

		ctx.fillStyle="white";
        ctx.font='20px "Press Start 2P"';
        ctx.fillText("~ Click Space to start ~",250,382.5);
    ctx.restore();
    timeout = setTimeout(drawMenuBackground,0.1);
}

function drawMenu(){
        drawMenuBackground();
}

function gameMenu(){ //called in MainGameFunctions
    drawMenu();
	window.addEventListener('keydown',start,false); 
}

function start(e){
    clearTimeout(timeout);
	if (e.keyCode == 32) {
        selectEnemy();
        window.removeEventListener('keydown',start);
    }
}

function loadMenuImg(){ //called in MainGameFunctions  
	menuBackground.src="./image/MenuBackground.png";
    enemyAIcon.src="./image/enemyA/iconA.png";
    enemyBIcon.src="./image/enemyB/iconB.png";
    enemyCIcon.src="./image/enemyC/iconC.png";
    }

function drawEnemyMenu(){
    ctx.save();

    ctx.drawImage(menuBackground,0,0,1000,600,0,0,1000,600);
    
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle="red";
    ctx.fillRect(0,0,width,height);
    ctx.restore();
    
    ctx.save();
    ctx.fillStyle="white";
    ctx.font='15px "Press Start 2P"';
    ctx.fillText("Select your enemy by pressing corresponding key",140, 250);
    ctx.drawImage(enemyAIcon,20,0,70,70,150,300,100,100);
    ctx.lineWidth=5;
    ctx.strokeRect(150,300,100,100);
    ctx.fillText("A",190, 430);
    ctx.drawImage(enemyBIcon,20,0,70,70,450,300,100,100);
    ctx.strokeRect(450,300,100,100);
    ctx.fillText("B",490, 430);
    ctx.drawImage(enemyCIcon,20,0,70,70,750,300,100,100);
    ctx.strokeRect(750,300,100,100);
    ctx.fillText("C",790, 430);
    ctx.restore();
    enemyMenuTimeout = setTimeout(drawEnemyMenu,0.1);
}

function selectEnemy(){
    drawEnemyMenu();
    
    window.addEventListener('keydown',setEnemy,false);
   
}

function setEnemy(c){
    clearTimeout(enemyMenuTimeout);
    
	if (c.keyCode == 65) {
        chosenEnemy="A";
	click_sound.play();
    }
    
    if (c.keyCode == 66) {
        chosenEnemy="B";
	click_sound.play();
    }
    
    if (c.keyCode == 67) {
        chosenEnemy="C";
	click_sound.play();
    }
   
    if (c.keyCode == 68) {
	chosenEnemy="D";
    }
     window.removeEventListener('keydown',setEnemy,false);
    initImg();
    initObstacle();
    gameStart();
}

////////////////////////////game menu end////////////////////////////////
