//global variable
var player;
var ctx;
var update_interval = 17; //frame update rate
var height = 600; //canvas height
var width = 1000; //canvas width


//initiation of game
function init(){
    //init canvas
    var canvas = document.getElementById("game");
    ctx=canvas.getContext && canvas.getContext('2d');
    
    
    //start game initiation when ctx is ready
    if (ctx) {
        //gameObject initiation
        player = new character();
        player.loadImage();
        
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
    draw();
    setTimeout(gameStart,update_interval);
 }
    
//draw : update game visual output  
 function draw(){
        // Clear the canvas
        ctx.clearRect(0, 0, width, height);
        
        //draw background 
        ctx.fillStyle = "#f1f1f1";
        ctx.fillRect(0, 0, width, height);
                
        player.draw();
}

//gravityMove : gravity Engine
 function gravityMove(object) {
        object.gravitySpeed += object.gravity;
        object.y += object.speedY + object.gravitySpeed;
        if (object.onGround) {
            object.y = 496;
        }
    }
    
//walking : walking Engine
 function walking(object) {
        object.x += object.speedX;
        }
        
function checkOnGround(object){ //check player is on ground (not yet fully implemented)
    //if condition => on ground
    if (object.y>=496) {
        object.onGround = true;
    }
}