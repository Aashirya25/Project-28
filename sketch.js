const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas,baseimage,playerimage;
var palyer, playerBase, playerArcher;
var playerArrows = [];
var board1, board2,board3,board4;
var numberOfArrows = 15
var score = 0
var shootsound

function preload() {
  backgroundImg = loadImage("./assets/background.png");
  baseimage = loadImage("./assets/base.png");
  playerimage = loadImage("./assets/player.png");
  shootsound = loadSound("assets/arrow.mp3")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);

  var options = {
    isStatic: true
  };

  playerBase = Bodies.rectangle(200, 320, 180, 150, options);
  World.add(world, playerBase);

  player = Bodies.rectangle(250, playerBase.position.y - 160, 50, 180, options);
  World.add(world,player)

  playerArcher = new PlayerArcher(
    340,
    playerBase.position.y - 112,
    120,
    120
  );

  board1 = new Board(width - 200, 100, 50, 200);
  board2 = new Board(width - 350, height - 280, 50, 200);
  board3 = new Board(width - 550, height - 90, 50, 200)
  board4 = new Board(width - 60, height - 300, 50, 200)

}

function draw() {
  background(backgroundImg );
  image(baseimage,playerBase.position.x,playerBase.position.y,180,150)
  image(playerimage,player.position.x,player.position.y,50,180)

  Engine.update(engine);
  playerArcher.display();

  board1.display();
  board2.display();
  board3.display()
  board4.display()

  
  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();

//call gameover function
      if(numberOfArrows==0){
        gameOver();
      }

//check collision
      var board1collision = Matter.SAT.collides(
        board1.body,
        playerArrows[i].body
      )

      var board2collision = Matter.SAT.collides(
        board2.body,
        playerArrows[i].body
      )

      var board3collision = Matter.SAT.collides(
        board3.body,
        playerArrows[i].body
      )
      var board4collision = Matter.SAT.collides(
        board4.body,
        playerArrows[i].body
      )
      }

        if(board1collision.collided){
          board1.remove()
        }
        if(board2collision.collided){
          board2.remove()
        }
        if(board3collision.collided){
          board3.remove()
        }
        if(board4collision.collided){
          board4.remove()
        }

        if(board1collision.collided||board2collision.collided||board3collision.collided||board4collision.collided){
          score+=2 
         
        }
      //code to add trajectory of arrow
       var posX = playerArrows[i].body.position.x;
       var posY = playerArrows[i].body.position.y;

       if (posX > width || posY > height) {
         if (playerArrows[i].isRemoved) {
           playerArrows[i].remove(i);
         } else {
           playerArrows[i].trajectory = [];
         }
       }

       
  }

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

   // instructions
   fill("#FFFF");
   textAlign("center");
   textSize(20);
   text("press space to shoot the targets use the arrow keys to move your bow up and down", 630, 140);
 

   //arrow count display
   fill(92,141,238);
   textAlign("center");
   textSize(30);
   text("Arrows left : " + numberOfArrows,200,100);
 
    //score count display
    fill(92,141,238);
    textAlign("center");
    textSize(30);
    text("Score : " + score,200,150);
  
}

function keyPressed() {
  if (keyCode === 32) {
    if(numberOfArrows > 0){
     var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;
      //console.log(angle);

      var arrow = new PlayerArrow(posX, posY, 100, 10, angle);

      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows = numberOfArrows-1
      shootsound.play()
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}

function gameOver(){
  swal(
  {
    title : `You  Won!`,
    text : "Well done! click play again to restart",
    imageUrl : 
    "https://github.com/Aashirya25/unfinished-28/blob/main/win.png",
    imageSize:"150x150",
    confirmButtonText: "Play again"
  },
  function(isConfirm) {
      if(isConfirm){
          location.reload()
        }
      }
    )
  }
