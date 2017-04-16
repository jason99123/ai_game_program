
///////////////Variables for menu/////////////////
var enemyAIcon = new Image();
var enemyBIcon = new Image();
var enemyCIcon = new Image();
var menuBackground = new Image();
var timeout;

///////////////End of Variables for menu/////////////////

//////////////Start of function for menu//////////////////////
function drawMenuBackground(){
    ctx.save();
    ctx.drawImage(menuBackground,0,0,840,525,0,0,1000,600);

		ctx.fillStyle="Black";
        ctx.font="30px Arial";
        ctx.fillText("~ Click Space to start ~",350,382.5);
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
	menuBackground.src="./image/MenuBackground.jpg";
    enemyAIcon.src="./image/enemyA/iconA.png";
    enemyBIcon.src="./image/enemyB/iconB.png";
    enemyCIcon.src="./image/enemyC/iconC.png";
    }

function drawEnemyMenu(){
    ctx.save();

    ctx.drawImage(menuBackground,0,0,840,525,0,0,1000,600);
    ctx.fillStyle="black";
    ctx.font="35px Arial";
    ctx.fillText("Select your enemy by pressing corresponding key",120, 250);
    ctx.drawImage(enemyAIcon,150,300);
    ctx.fillText("A",170, 430);
    ctx.drawImage(enemyBIcon,450,300);
    ctx.fillText("B",470, 430);
    ctx.drawImage(enemyCIcon,750,300);
    ctx.fillText("C",770, 430);
    
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
    }
    
    if (c.keyCode == 66) {
        chosenEnemy="B";
    }
    
    if (c.keyCode == 67) {
        chosenEnemy="C";
    }
     window.removeEventListener('keydown',setEnemy,false);
    initImg();
    initObstacle();
    gameStart();
}

////////////////////////////game menu end////////////////////////////////