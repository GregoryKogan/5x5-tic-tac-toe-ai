let MainField;
let Player2;
let ModelData;
let Turn;
let History;
let ThiccFont;
let ThinFont;
let RegularFont;

function preload(){
  ModelData = loadJSON("BotBrain.json");
  ThiccFont = loadFont('Fonts/Roboto-Black.ttf');
  ThinFont = loadFont('Fonts/Roboto-Thin.ttf');
  RegularFont = loadFont('Fonts/Roboto-Regular.ttf');
  loadFont('Fonts/Roboto-Black.ttf');
  loadFont('Fonts/Roboto-Thin.ttf');
  loadFont('Fonts/Roboto-Regular.ttf');
}

function setup(){
  SetUpUI();
  if (Os != "IOS"){
    LoadModel();
    if (Device == "Laptop")
      createCanvas(windowWidth - 5, windowHeight - 5);
    else
      createCanvas(windowWidth + 1, windowHeight + 1);
    DrawFirstFrame();
  }
  else{
    createCanvas(windowWidth + 1, windowHeight + 1);
  }
}

function draw(){
  if (Os != "IOS")
    Visualize();
  else{
    background(18);
    textFont(ThiccFont);
    textAlign(CENTER);
    fill(255);
    textSize(18);
    text("Your device is not supported", windowWidth / 2, windowHeight / 2 - 20);
    textFont(RegularFont);
    text("I hate IOS", windowWidth / 2, windowHeight / 2 + 20);
  }
}
