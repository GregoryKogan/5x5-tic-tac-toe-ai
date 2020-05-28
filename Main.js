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
  LoadModel();
  if (Device == "Laptop")
    resizeCanvas(windowWidth - 5, windowHeight - 5);
  else
    resizeCanvas(windowWidth + 1, windowHeight + 1);
  DrawFirstFrame();
}

function draw(){
  Visualize();
}
