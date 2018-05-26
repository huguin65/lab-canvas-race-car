window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
  };

  function startGame() {
    gameArea.start();
    player = new Car(130, 500, 40, 80);
    player.update();
  }

  let myObstacles = [];

  let gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
              this.canvas.width = 300;
              this.canvas.height = 600;
              this.context = this.canvas.getContext("2d");
              this.drawRoad();
              document.getElementById("game-board").insertBefore(this.canvas, document.getElementById("game-board").childNodes[0]);
              this.interval = setInterval(updateGameArea, 20);
            },
    frames: 0,
    clear : function() {
              this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            },
    score: function() {
              points = (Math.floor(this.frames/5))
              this.context.font = '18px serif';
              this.context.fillStyle = 'black';
              this.context.fillText('Score: '+points, 50, 50);
            },
    stop : function() {
                clearInterval(this.interval);
                this.context.fillStyle = "rgba(0,0,0,0.7)";
                this.context.fillRect(0,0,300,600);
                this.context.font = "40px serif";
                this.context.fillStyle = "red";
                this.context.fillText("Game Over!", 55, 300);
                this.context.fillStyle = "white";
                this.context.fillText("Your final score", 20, 345);
                this.context.fillText(points, 120, 390);
            },
    drawRoad : function(){
              this.context.fillStyle = "green"
              this.context.fillRect(0,0,300,600);
              this.context.fillStyle = "grey"
              this.context.fillRect(30,0,240,600);
              this.context.strokeStyle= "white";
              this.context.lineWidth = 5;
              this.context.setLineDash([15, 15]);
              this.context.moveTo(150,15);
              this.context.lineTo(150,600);
              this.context.clearRect(40,0,6,600);
              this.context.clearRect(254,0,6,600);
              this.context.stroke();
    }
  }

  function Car(x, y, width, height) {
    this.x = x;
    this.y = y; 
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.img = new Image();
    this.img.src = "images/car.png";
    ctx = gameArea.context;
    this.update = function(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height); 
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY; 
    }
    this.left   = function() { return this.x                 }
    this.right  = function() { return (this.x + this.width)  }
    this.top    = function() { return this.y                 }
    this.bottom = function() { return this.y + (this.height) }
    
    this.crashWith = function(obstacle) {
      return !((this.bottom() < obstacle.top())    ||
               (this.top()    > obstacle.bottom()) ||
               (this.right()  < obstacle.left())   ||
               (this.left()   > obstacle.right())) 
    }
  }

  function Obstacle(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    ctx = gameArea.context;
    this.update = function(){
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.left   = function() { return this.x                 }
    this.right  = function() { return (this.x + this.width)  }
    this.top    = function() { return this.y                 }
    this.bottom = function() { return this.y + (this.height) }
}

  function updateGameArea(){
    for (i = 0; i < myObstacles.length; i += 1) {
      if (player.crashWith(myObstacles[i])) {
        gameArea.stop();
        return;
      } 
    }
    gameArea.clear();
    gameArea.drawRoad();
    gameArea.frames +=1;
    if (gameArea.frames % 100 === 0) {
        x = gameArea.canvas.width;
        minWidth = 80;
        maxWidth = 160;
        width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
        (myObstacles.length>=4) && myObstacles.splice(0,1); 
        myObstacles.push(new Obstacle(width, 10, "red", 30 + Math.floor(Math.random()*(240-width)), 0));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += 2;
        myObstacles[i].update();
    }
    player.newPos();
    player.update();
    gameArea.score();
  }

  function moveUp() {
    (player.y > 10) ? 
    player.speedY -= 1 : player.speedY = 0; 
  }

  function moveDown() {
    (player.y < 510) ? 
    player.speedY += 1 : player.speedY = 0; 
  }

  function moveLeft() {
    (player.x > 30) ? 
    player.speedX -= 1 : player.speedX = 0;
  }

  function moveRight() {
    (player.x < 230) ? 
    player.speedX += 1 : player.speedX = 0;
  }

  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 38:
        moveUp();
        break;
      case 40:
        moveDown();
        break;
      case 37:
        moveLeft();
        break;
      case 39:
        moveRight();
        break;
    }
  }

  document.onkeyup = function(e) {
    stopMove();
  }

  function stopMove() {
      player.speedX = 0;
      player.speedY = 0; 
  }
};