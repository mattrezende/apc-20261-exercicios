

var p5Inst = new p5(null, 'sketch');

window.preload = function () {
  initMobileControls(p5Inst);

  p5Inst._predefinedSpriteAnimations = {};
  p5Inst._pauseSpriteAnimationsByDefault = false;
  var animationListJSON = {"orderedKeys":[],"propsByKey":{}};
  var orderedKeys = animationListJSON.orderedKeys;
  var allAnimationsSingleFrame = false;
  orderedKeys.forEach(function (key) {
    var props = animationListJSON.propsByKey[key];
    var frameCount = allAnimationsSingleFrame ? 1 : props.frameCount;
    var image = loadImage(props.rootRelativePath, function () {
      var spriteSheet = loadSpriteSheet(
          image,
          props.frameSize.x,
          props.frameSize.y,
          frameCount
      );
      p5Inst._predefinedSpriteAnimations[props.name] = loadAnimation(spriteSheet);
      p5Inst._predefinedSpriteAnimations[props.name].looping = props.looping;
      p5Inst._predefinedSpriteAnimations[props.name].frameDelay = props.frameDelay;
    });
  });

  function wrappedExportedCode(stage) {
    if (stage === 'preload') {
      if (setup !== window.setup) {
        window.setup = setup;
      } else {
        return;
      }
    }
// -----

// =========================
// PAC-SNAKE
// =========================

// posição da cabeça
var x = 200;
var y = 200;

// direção
var dx = 20;
var dy = 0;

// velocidade
var speed = 4;

// cauda
var tail = [];

// começa com 1 bolinha
for (var i = 0; i < 1; i++) {

  tail.push({
    x: x - i * 20,
    y: y
  });
}

// comida preta
var blackFood = {
  x: randomNumber(20, 380),
  y: randomNumber(20, 380)
};

// comida branca
var whiteFood = {
  x: randomNumber(20, 380),
  y: randomNumber(20, 380)
};

// animação da boca
var mouthOpen = true;

// game over
var gameOver = false;


// =========================
// LOOP PRINCIPAL
// =========================

function draw() {

  background("gray");

  if (gameOver) {

    textSize(40);
    fill("red");
    text("GAME OVER", 80, 200);

    return;
  }

  controls();

  moveSnake();

  infiniteBorder();

  checkFood();

  checkSelfCollision();

  drawFoods();

  drawSnake();

  animateMouth();

  drawInfo();
}


// =========================
// CONTROLES
// =========================

function controls() {

  if (keyDown("up") && dy === 0) {

    dx = 0;
    dy = -20;
  }

  if (keyDown("down") && dy === 0) {

    dx = 0;
    dy = 20;
  }

  if (keyDown("left") && dx === 0) {

    dx = -20;
    dy = 0;
  }

  if (keyDown("right") && dx === 0) {

    dx = 20;
    dy = 0;
  }
}


// =========================
// MOVIMENTO
// =========================

function moveSnake() {

  if (frameCount % speed === 0) {

    // move cauda
    for (var i = tail.length - 1; i > 0; i--) {

      tail[i].x = tail[i - 1].x;
      tail[i].y = tail[i - 1].y;
    }

    // primeira bolinha segue cabeça
    tail[0].x = x;
    tail[0].y = y;

    // move cabeça
    x += dx;
    y += dy;
  }
}


// =========================
// BORDA INFINITA
// =========================

function infiniteBorder() {

  if (x > 400) {
    x = 0;
  }

  if (x < 0) {
    x = 400;
  }

  if (y > 400) {
    y = 0;
  }

  if (y < 0) {
    y = 400;
  }
}


// =========================
// DESENHAR COBRA
// =========================

function drawSnake() {

  // cauda
  for (var i = 0; i < tail.length; i++) {

    fill("yellow");
    stroke("black");

    ellipse(
      tail[i].x,
      tail[i].y,
      18,
      18
    );
  }

  // cabeça Pac-Man
  fill("yellow");
  stroke("black");

  if (mouthOpen) {

    // direita
    if (dx > 0) {
      arc(x, y, 24, 24, 40, 320);
    }

    // esquerda
    else if (dx < 0) {
      arc(x, y, 24, 24, 220, 140);
    }

    // baixo
    else if (dy > 0) {
      arc(x, y, 24, 24, 130, 50);
    }

    // cima
    else if (dy < 0) {
      arc(x, y, 24, 24, 310, 230);
    }

  } else {

    ellipse(x, y, 24, 24);
  }
}


// =========================
// ANIMAÇÃO DA BOCA
// =========================

function animateMouth() {

  if (frameCount % 10 === 0) {

    mouthOpen = !mouthOpen;
  }
}


// =========================
// DESENHAR COMIDAS
// =========================

function drawFoods() {

  // comida preta
  fill("black");

  ellipse(
    blackFood.x,
    blackFood.y,
    15,
    15
  );

  // comida branca
  fill("white");

  ellipse(
    whiteFood.x,
    whiteFood.y,
    15,
    15
  );
}


// =========================
// COMIDAS
// =========================

function checkFood() {

  // =====================
  // COMIDA PRETA
  // =====================

  if (dist(x, y, blackFood.x, blackFood.y) < 20) {

    // aumenta cauda
    tail.push({
      x: tail[tail.length - 1].x,
      y: tail[tail.length - 1].y
    });

    respawnFoods();
  }


  // =====================
  // COMIDA BRANCA
  // =====================

  if (dist(x, y, whiteFood.x, whiteFood.y) < 20) {

    // menos de 4 = morre
    if (tail.length < 4) {

      gameOver = true;

    } else {

      // remove 3 partes
      tail.splice(tail.length - 3, 3);

      respawnFoods();
    }
  }
}


// =========================
// RESSURGIR COMIDAS
// =========================

function respawnFoods() {

  blackFood.x = randomNumber(20, 380);
  blackFood.y = randomNumber(20, 380);

  whiteFood.x = randomNumber(20, 380);
  whiteFood.y = randomNumber(20, 380);
}


// =========================
// COLISÃO COM CORPO
// =========================

function checkSelfCollision() {

  for (var i = 1; i < tail.length; i++) {

    if (dist(x, y, tail[i].x, tail[i].y) < 10) {

      gameOver = true;
    }
  }
}


// =========================
// INFORMAÇÕES
// =========================

function drawInfo() {

  fill("white");
  textSize(16);

  text(
    "Tamanho: " + tail.length,
    10,
    20
  );
}
// -----
    try { window.draw = draw; } catch (e) {}
    switch (stage) {
      case 'preload':
        if (preload !== window.preload) { preload(); }
        break;
      case 'setup':
        if (setup !== window.setup) { setup(); }
        break;
    }
  }
  window.wrappedExportedCode = wrappedExportedCode;
  wrappedExportedCode('preload');
};

window.setup = function () {
  window.wrappedExportedCode('setup');
};
