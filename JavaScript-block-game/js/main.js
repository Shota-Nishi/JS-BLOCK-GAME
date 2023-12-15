const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ballRadius = 10; //描画された円の半径を保持し、計算に使用する


// ボールの開始位置（中央下）定義
let x = canvas.width / 2; //　x軸(左上から) 480px / 2 = 240px　（中央）
let y = canvas.height - 30 //　y軸(左上から) 320px - 30px = 290px
let dx = 2;
let dy = -2;



// パドルの高さと幅、 x 軸上の開始地点を定義
const paddleHeight = 10;
const paddlewidth = 75;
let paddleX = (canvas.width - paddlewidth) / 2;

//パドル左右初期値
let rightPressed = false;
let leftPressed = false;


//ブロックの変数
const brickRowCount = 3;  //行(横方向)　3つ
const brickColumnCount = 5; //列(縦方向)　5つ
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30; //topからの座標表示
const brickOffsetLeft = 30; //leftからの座標表示


//スコア初期値
let score = 0;

//プレイヤ―ライフ
let lives = 3; 

//二次元配列でブロックを記録
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}


//キーが押され時、keyDownHandllerを呼び出す。
document.addEventListener('keydown', keyDownHandller, false);
document.addEventListener('keyup', keyupHandller, false);

//マウスを動かしたときmouseMoveHandlerを呼び出す
document.addEventListener("mousemove", mouseMoveHandler,false);


function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddlewidth / 2;
  }
}


//左右キーが押されたとき
function keyDownHandller(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

//左右キーが離されたとき
function keyupHandller(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}


// ボールを描画
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}


// パドルを描画
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddlewidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}


//衝突検出関数
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
            clearInterval(interval); 
          }
        }
      }
    }
  }
}

// スコアの表示、更新
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}


//ライフの表示、更新
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}


//ブロックを描画
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if(bricks[c][r].status === 1) {
      const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
      const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
      bricks[c][r].x = brickX;
      bricks[c][r].y = brickY;
      ctx.beginPath();
      ctx.rect(brickX, brickY, brickWidth, brickHeight);
      ctx.fillstyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
      }
    }
  }
}


function draw() {
  //キャンバスリセット
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  //x軸衝突判定
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  //y軸衝突判定
  //y軸上側
  if (y + dy < ballRadius) {
    dy = -dy;
    // y軸下側
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddlewidth) {
      dy = -dy
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.relode();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddlewidth > canvas.width) {
      paddleX = canvas.width - paddlewidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }

  x += dx;
  y += dy;
  
  requestAnimationFrame(draw);
}



draw();