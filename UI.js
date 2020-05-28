let RestartButton;
let Device;
let Os;

function SetUpUI(){
  DetectDevice();

  let ButtonColor = color(18);
  RestartButton = createButton("Play");
  if (Device == "Laptop"){
    RestartButton.size(200, 50);
    RestartButton.style('font-size', '25px');
    RestartButton.position(windowWidth / 2 - 100, windowHeight - (windowHeight / 2 - windowWidth / 6) / 2 - 25);
  }
  else{
    RestartButton.position(windowWidth / 2 - windowWidth / 6, windowHeight - windowWidth / 7 - 35);
    RestartButton.style('font-size', '20px');
    RestartButton.size(windowWidth / 3, windowWidth / 7);
  }
  RestartButton.style('background-color', ButtonColor);
  RestartButton.style('color', 'white');
  RestartButton.style('font-family', 'Roboto-Black');
  RestartButton.mousePressed(Restart);
}

function UpdateUI(){
  if (Device == "Laptop"){
    RestartButton.size(200, 50);
    RestartButton.style('font-size', '25px');
    RestartButton.position(windowWidth / 2 - 100, windowHeight - (windowHeight / 2 - windowWidth / 6) / 2 - 25);
  }
  else{
    RestartButton.position(windowWidth / 2 - windowWidth / 6, windowHeight - windowWidth / 7 - 20);
    RestartButton.style('font-size', '20px');
    RestartButton.size(windowWidth / 3, windowWidth / 7);
  }
}

function DrawFirstFrame(){
  background(18);
  if (Device == "Laptop"){
    let Width = windowWidth / 3;
    let StartX = (windowWidth / 2) - (Width / 2);
    let StartY = (windowHeight / 2) - (Width / 2);
    push();
    noFill();
    stroke(246, 202, 9);
    strokeWeight(3);
    square(StartX - 3, StartY - 3, Width + 6);
    stroke(255);
    square(StartX, StartY, Width);
    pop();
  }
  else{
    let Width = windowWidth - 30;
    let StartX = (windowWidth / 2) - (Width / 2);
    let StartY = 100;
    push();
    noFill();
    stroke(246, 202, 9);
    strokeWeight(3);
    square(StartX - 3, StartY - 3, Width + 6);
    stroke(255);
    square(StartX, StartY, Width);
    pop();
  }
  fill(255);
  textFont(RegularFont);
  textSize(11);
  textAlign(LEFT);
  text("G.Koganovskiy 2020", 10, windowHeight - 10);
  textAlign(RIGHT);
  text("v1.0", windowWidth - 10, windowHeight - 10);
  textAlign(CENTER);
  text(Os, windowWidth / 2, windowHeight - 10);
}

function Visualize(){
  textFont(RegularFont);
  if (Device == "Laptop"){
    if (MainField instanceof Field){
      background(18);
      MainField.Render();
      textSize(30);
      fill(255);
      textFont(RegularFont);
      textAlign(CENTER);
      let Status = GetStatus();
      text("Status:", windowWidth / 6, windowHeight / 2 - windowWidth / 6 + 10)
      textSize(26);
      textFont(ThinFont);
      if (Status == "Still playing" || Status == "Error" || Status == "Draw")
        text(Status, windowWidth / 6, windowHeight / 2 - windowWidth / 6 + 50);
      else
        text(Status + " won!", windowWidth / 6, windowHeight / 2 - windowWidth / 6 + 50);
      textSize(30);
      textFont(ThiccFont);
      if (Turn == 1 && Status == "Still playing")
        text("Your turn", windowWidth / 2, (windowHeight / 2 - windowWidth / 6) / 2 + 10);
      else if (Turn == 2 && Status == "Still playing")
        text("AI is thinking", windowWidth / 2, (windowHeight / 2 - windowWidth / 6) / 2 + 10);
      textFont(RegularFont);
      text("History:", windowWidth / 6 * 5, windowHeight / 2 - windowWidth / 6 + 10);
      textSize(26);
      textFont(ThinFont);
      for (let i = History.length - 1; i > History.length - 13 && i >= 0; --i){
        text(History[i], windowWidth / 6 * 5, windowHeight / 2 - windowWidth / 6 + 10 + (History.length - i) * 40);
      }
    }
    else{
      DrawFirstFrame();
    }
    push();
    stroke(255);
    strokeWeight(8);
    line(0, 0, windowWidth, 0);
    strokeWeight(10);
    line(0, 0, 0, windowHeight);
    pop();
    textFont(RegularFont);
    textSize(11);
    textAlign(LEFT);
    text("G.Koganovskiy 2020", 10, windowHeight - 10);
    textAlign(RIGHT);
    text("v1.0", windowWidth - 10, windowHeight - 10);
  }
  else{
    if (MainField instanceof Field){
      background(18);
      MainField.Render();
      textSize(25);
      fill(255);
      textAlign(LEFT);
      textFont(RegularFont);
      let Status = GetStatus();
      text("Status:", 15, windowWidth + 120);
      textFont(ThinFont);
      if (Status == "Still playing" || Status == "Error" || Status == "Draw")
        text(Status, 100, windowWidth + 120);
      else
        text(Status + " won!", 120, windowWidth + 120);
      textFont(RegularFont);
      text("Last move:", 15, windowWidth + 170);
      textFont(ThinFont);
      text(History[History.length - 1], 145, windowWidth + 170);
      textAlign(CENTER);
      textFont(ThiccFont);
      if (Turn == 1 && Status == "Still playing")
        text("Your turn", windowWidth / 2, 60);
      else if (Turn == 2 && Status == "Still playing")
        text("AI is thinking", windowWidth / 2, 60);
      textFont(RegularFont);
      textSize(11);
      textAlign(LEFT);
      text("G.Koganovskiy 2020", 10, windowHeight - 10);
      textAlign(RIGHT);
      text("v1.0", windowWidth - 10, windowHeight - 10);
    }
    else{
      DrawFirstFrame();
    }
  }
}

function DetectDevice(){
  if (min(displayWidth / 4.29, displayHeight / 4.29) >= 150)
    Device = "Laptop";
  else
    Device = "Phone";
  if (navigator.userAgent.indexOf("like Mac") != -1){
    Os = "IOS";
    Device = "Phone";
  }
}

function windowResized(){
  if (Device == "Laptop")
    resizeCanvas(windowWidth - 5, windowHeight - 5);
  else
    resizeCanvas(windowWidth + 1, windowHeight + 1);
  UpdateUI();
}
