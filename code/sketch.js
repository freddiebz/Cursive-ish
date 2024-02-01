// parameters
let p = {};
const LINE_HEIGHT = 70;
const SPACE = 20;

// list of agents
let agents;

// cursive library to generate "words"
let lib;

// border and background settings
let transformX;
let transformY;

// paper effects
let bg;
let paperOpacity;
let agedPaper;

// keep track of writing progress
let line;
let completedWords;

// control word speed and spread
let spread;
let steps;

function setup() {
  bg = loadImage("assets/old paper.jpg");
  createCanvas(600, 600).style("display", "block");

  transformX = windowWidth / 3;
  transformY = windowHeight / 20;

  //load cursive elements
  lib = new curvsiveLib();

  // initialize most params
  reset();

  // setup the window and create the agents
  setupWindow();
  createAgents();
}

function draw() {
  // clear the background
  background(bg);

  //create black border around paper
  push();
  fill(color(253, paperOpacity));
  rect(transformX, transformY, transformY * 14, transformY * 18);

  fill(color(0));
  rect(0, 0, transformX, windowHeight); //left
  rect(0, 0, windowWidth, transformY); //up
  rect(transformX + transformY * 14, 0, transformX, windowHeight); //right
  rect(0, transformY + transformY * 18, windowWidth, transformY); //bottom
  pop();

  // update all the agents
  for (a of agents) {
    a.update();
  }

  // draw all the agents
  for (a of agents) {
    a.draw();
  }

  if (line >= 2 && paperOpacity <= 255 && agedPaper) {
    //better for fullscreen
    paperOpacity += 0.07;
    //better for not... fullscreen
    // paperOpacity += 0.075;
  }

  // create and begin drawing next word
  let last = agents[agents.length - 1];
  if (!last.done()) return;

  if (line * LINE_HEIGHT < transformY * 18) {
    if (steps > 1) {
      steps--;
    }

    let a;
    let word = lib.generateWord();
    if (
      last.tail() + lib.wordLen(word) + SPACE - transformX >
      transformY * 14
    ) {
      line++;
      a = new Agent(word, transformX, line * LINE_HEIGHT + transformY, steps);
    } else {
      a = new Agent(
        word,
        last.tail() + SPACE,
        line * LINE_HEIGHT + transformY,
        steps
      );
    }
    agents.push(a);
  } else {
    completedWords = true;
  }

  //better for fullscreen, spread covers more area faster
  if (spread < 200) {
    if (completedWords) {
      // slow down the final spread by just that *tiny* bit
      spread++;
    } else {
      spread += 4;
    }

    agents.forEach((e) => {
      e.increaseSpread(spread);
    });
  }

  //better for not... fullscreen
  // if (spread < 135) {
  //   spread += 2;

  //   agents.forEach((e) => {
  //     e.increaseSpread(spread);
  //   });
  // }

  if (completedWords && spread >= 135) {
    let allFaded = true;
    for (a of agents) {
      a.beginFade();
      if (!a.faded()) {
        allFaded = false;
      }
    }

    if (allFaded && paperOpacity > 0) {
      agedPaper = false;
      paperOpacity -= 3;
    } else if (allFaded && paperOpacity <= 0) {
      reset();
      createAgents();
    }
  }
}

function setupWindow() {
  let width;
  let height;

  // setup the canvas
  width = windowWidth;
  height = windowHeight;
  resizeCanvas(width, height);

  // set the top left corner of the paper
  transformY = height / 20;
  transformX = width / 2 - transformY * 7;

  // clear the background
  background(bg);
}

function createAgents() {
  // clear agent list
  agents = [];

  // start with one agent, more will be added when one is done being written
  let word = lib.generateWord();
  let a = new Agent(word, transformX, transformY, steps);
  agents.push(a);
}

function reset() {
  paperOpacity = 0;
  line = 0;
  spread = 20;
  steps = 40;

  completedWords = false;
  agedPaper = true;
}

function keyPressed() {
  // space to reset all agents
  if (key == " ") {
    setupWindow();
    reset();
    createAgents();
  }
  // SHIFT-S saves the current canvas
  if (key == "S") {
    save("canvas.png");
  }
}

function windowResized() {
  setupWindow();
  reset();
  createAgents();
}
