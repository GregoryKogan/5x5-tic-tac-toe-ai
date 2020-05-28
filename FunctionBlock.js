let Timer;

function mouseClicked(){
  if (Device == "Laptop"){
    if (abs(mouseX - windowWidth / 2) < windowWidth / 6 && abs(mouseY - windowHeight / 2) < windowWidth / 6){
      if (Turn == 1 && frameCount > Timer + 10 && GetStatus() == "Still playing"){
        let ClickedCellX = undefined;
        let ClickedCellY = undefined;
        let MinDist = windowWidth * 100;
        for (let i = 0; i < 5; ++i){
          for (let j = 0; j < 5; ++j){
            let CellX, CellY;
            let Width = windowWidth / 3;
            CellX = (windowWidth / 2) - (Width / 2) + (j * Width / 5) + Width / 10;
            CellY = (windowHeight / 2) - (Width / 2) + (i * Width / 5) + Width / 10;
            if (dist(mouseX, mouseY, CellX, CellY) < MinDist){
              MinDist = dist(mouseX, mouseY, CellX, CellY)
              ClickedCellX = j + 1;
              ClickedCellY = i + 1;
            }
          }
        }
        if (MainField.Data[ClickedCellY - 1][ClickedCellX - 1].Type == "Empty"){
          MainField.MakeMove(ClickedCellY, ClickedCellX, "Circle");
          History.push("Circle: (" + ClickedCellY + ", " + ClickedCellX + ")");
          Turn = 2;
          setTimeout(BotManagement, 100);
        }
      }
    }
  }
  else{
    let Width = windowWidth - 30;
    let StartX = (windowWidth / 2) - (Width / 2);
    let StartY = 100;
    if (abs(mouseX - windowWidth / 2) < Width / 2 && abs(mouseY - (100 + Width / 2)) < Width / 2){
      if (Turn == 1 && frameCount > Timer + 10 && GetStatus() == "Still playing"){
        let ClickedCellX = undefined;
        let ClickedCellY = undefined;
        let MinDist = windowHeight * 100;
        for (let i = 0; i < 5; ++i){
          for (let j = 0; j < 5; ++j){
            let CellX, CellY;
            CellX = StartX + (j * Width / 5) + Width / 10;
            CellY = StartY + (i * Width / 5) + Width / 10;
            if (dist(mouseX, mouseY, CellX, CellY) < MinDist){
              MinDist = dist(mouseX, mouseY, CellX, CellY)
              ClickedCellX = j + 1;
              ClickedCellY = i + 1;
            }
          }
        }
        if (MainField.Data[ClickedCellY - 1][ClickedCellX - 1].Type == "Empty"){
          MainField.MakeMove(ClickedCellY, ClickedCellX, "Circle");
          History.push("Circle: (" + ClickedCellY + ", " + ClickedCellX + ")");
          Turn = 2;
          setTimeout(BotManagement, 100);
        }
      }
    }
  }
}

async function BotManagement(){
  Timer = frameCount;
  if (GetStatus() == "Still playing"){
    if (Turn == 2){
      if (ALGMove() == "NONE"){
        let Response = await Player2.Think(MainField, Device);
        MainField.MakeMove(Response.y, Response.x, "Cross");
        History.push("Cross: (" + Response.y + ", " + Response.x + ")");
      }
      Turn = 1;
    }
  }
}

function ALGMove(){
  //Поиск выигрышных мест в этом ходу
  for (let i = 0; i < 5; ++i){
    for (let j = 0; j < 5; ++j){
      if (MainField.Data[i][j].Type == "Empty"){
        MainField.MakeMove(i + 1, j + 1, "Cross");
        let Result = GetStatus();
        MainField.MakeMove(i + 1, j + 1, "Empty");
        if (Result == "Cross"){
          MainField.MakeMove(i + 1, j + 1, "Cross");
          History.push("Cross: (" + (i + 1) + ", " + (j + 1) + ")");
          return "Made move";
        }
      }
    }
  }
  //Поиск проигрышных мест в следующем ходу
  for (let i = 0; i < 5; ++i){
    for (let j = 0; j < 5; ++j){
      if (MainField.Data[i][j].Type == "Empty"){
        MainField.MakeMove(i + 1, j + 1, "Circle");
        let Result = GetStatus();
        MainField.MakeMove(i + 1, j + 1, "Empty");
        if (Result == "Circle"){
          MainField.MakeMove(i + 1, j + 1, "Cross");
          History.push("Cross: (" + (i + 1) + ", " + (j + 1) + ")");
          return "Made move";
        }
      }
    }
  }
  //Попытка самому построить вилку
  let LineList = GetLineList();
  for (let i = 0; i < 12; ++i){
    let Result = NeedsLinearFork(LineList[i]);
    if (Result != "NONE"){
      let Move = new MoveInfo;
      if (i < 5){
        Move.y = i + 1;
        Move.x = Result + 1;
      }
      else if (i >= 5 && i < 10){
        Move.y = Result + 1;
        Move.x = i + 1 - 5;
      }
      else if (i == 10){
        Move.y = Result + 1;
        Move.x = Result + 1;
      }
      else if (i == 11){
        Move.y = Result + 1;
        Move.x = 5 - Result;
      }
      MainField.MakeMove(Move.y, Move.x, "Cross");
      History.push("Cross: (" + Move.y + ", " + Move.x + ")");
      return "Made move";
    }
  }
  //Поиск линейных развилок у противника
  LineList = GetLineList();
  for (let i = 0; i < 12; ++i){
    let Result = HasLinearFork(LineList[i]);
    if (Result != "NONE"){
      let Move = new MoveInfo;
      if (i < 5){
        Move.y = i + 1;
        Move.x = Result + 1;
      }
      else if (i >= 5 && i < 10){
        Move.y = Result + 1;
        Move.x = i + 1 - 5;
      }
      else if (i == 10){
        Move.y = Result + 1;
        Move.x = Result + 1;
      }
      else if (i == 11){
        Move.y = Result + 1;
        Move.x = 5 - Result;
      }
      MainField.MakeMove(Move.y, Move.x, "Cross");
      History.push("Cross: (" + Move.y + ", " + Move.x + ")");
      return "Made move";
    }
  }
  return "NONE";
}

function NeedsLinearFork(Line){
  //Случай _XX__
  if (Line[0].Type == "Empty" && Line[1].Type == "Cross" && Line[2].Type == "Cross" && Line[3].Type == "Empty" && Line[4].Type == "Empty")
    return 3;
  //Случай __XX_
  if (Line[0].Type == "Empty" && Line[1].Type == "Empty" && Line[2].Type == "Cross" && Line[3].Type == "Cross" && Line[4].Type == "Empty")
    return 1;
  //Случай _X_X_
  if (Line[0].Type == "Empty" && Line[1].Type == "Cross" && Line[2].Type == "Empty" && Line[3].Type == "Cross" && Line[4].Type == "Empty")
    return 2;
  return "NONE";
}

function HasLinearFork(Line){
  //Случай _OO__
  if (Line[0].Type == "Empty" && Line[1].Type == "Circle" && Line[2].Type == "Circle" && Line[3].Type == "Empty" && Line[4].Type == "Empty")
    return 3;
  //Случай __OO_
  if (Line[0].Type == "Empty" && Line[1].Type == "Empty" && Line[2].Type == "Circle" && Line[3].Type == "Circle" && Line[4].Type == "Empty")
    return 1;
  //Случай _O_O_
  if (Line[0].Type == "Empty" && Line[1].Type == "Circle" && Line[2].Type == "Empty" && Line[3].Type == "Circle" && Line[4].Type == "Empty")
    return 2;
  return "NONE";
}

function GetLineList(){
  //Разделить 2D доску на 16 1D массивов, а потом для каждого проверить есть ли там 4 подряд
  let ArrayStorage = [];
  //Горизонтали
  for (let i = 0; i < 5; ++i){
    let Line = [];
    for (let j = 0; j < 5; ++j){
      Line.push(MainField.Data[i][j])
    }
    ArrayStorage.push(Line);
  }
  //Вертикали
  for (let i = 0; i < 5; ++i){
    let Line = [];
    for (let j = 0; j < 5; ++j){
      Line.push(MainField.Data[j][i])
    }
    ArrayStorage.push(Line);
  }
  //Основная диагональ
  let MidDiagonal = [];
  MidDiagonal.push(MainField.Data[0][0]);
  for (let i = 1; i < 4; ++i){
    MidDiagonal.push(MainField.Data[i][i]);
  }
  MidDiagonal.push(MainField.Data[4][4]);
  ArrayStorage.push(MidDiagonal);
  //Побочная диагональ
  let DopMidDiagonal = [];
  DopMidDiagonal.push(MainField.Data[0][4]);
  for (let i = 1; i < 4; ++i){
    DopMidDiagonal.push(MainField.Data[i][4 - i]);
  }
  DopMidDiagonal.push(MainField.Data[4][0]);
  ArrayStorage.push(DopMidDiagonal);

  return ArrayStorage;
}

function GetStatus(){
  //Разделить 2D доску на 16 1D массивов, а потом для каждого проверить есть ли там 4 подряд
  let ArrayStorage = [];
  //Горизонтали
  for (let i = 0; i < 5; ++i){
    let Line = [];
    for (let j = 0; j < 5; ++j){
      Line.push(MainField.Data[i][j])
    }
    ArrayStorage.push(Line);
  }
  //Вертикали
  for (let i = 0; i < 5; ++i){
    let Line = [];
    for (let j = 0; j < 5; ++j){
      Line.push(MainField.Data[j][i])
    }
    ArrayStorage.push(Line);
  }
  //Основные диагонали
  let UpDiagonal = [];
  let MidDiagonal = [];
  let DownDiagonal = [];
  MidDiagonal.push(MainField.Data[0][0]);
  DownDiagonal.push(MainField.Data[1][0]);
  for (let i = 1; i < 4; ++i){
    MidDiagonal.push(MainField.Data[i][i]);
    DownDiagonal.push(MainField.Data[i + 1][i]);
    UpDiagonal.push(MainField.Data[i - 1][i]);
  }
  MidDiagonal.push(MainField.Data[4][4]);
  UpDiagonal.push(MainField.Data[3][4]);
  ArrayStorage.push(MidDiagonal);
  ArrayStorage.push(DownDiagonal);
  ArrayStorage.push(UpDiagonal);
  //Побочные диагонали
  let DopUpDiagonal = [];
  let DopMidDiagonal = [];
  let DopDownDiagonal = [];
  DopMidDiagonal.push(MainField.Data[0][4]);
  DopDownDiagonal.push(MainField.Data[1][4]);
  for (let i = 1; i < 4; ++i){
    DopMidDiagonal.push(MainField.Data[i][4 - i]);
    DopDownDiagonal.push(MainField.Data[i + 1][4 - i]);
    DopUpDiagonal.push(MainField.Data[i - 1][4 - i]);
  }
  DopMidDiagonal.push(MainField.Data[4][0]);
  DopUpDiagonal.push(MainField.Data[3][0]);
  ArrayStorage.push(DopMidDiagonal);
  ArrayStorage.push(DopDownDiagonal);
  ArrayStorage.push(DopUpDiagonal);
  //Получили все массивы, теперь надо их обработать
  let CircleCounter = 0;
  let CrossCounter = 0;
  for (let i = 0; i < ArrayStorage.length; ++i){
    if (AreHere4CirclesInARow(ArrayStorage[i]))
      CircleCounter++;
    if (AreHere4CrossesInARow(ArrayStorage[i]))
      CrossCounter++;
  }

  //Display2DArray(ArrayStorage);

  //Обработали, теперь расчитваем и выводим результат
  if (CircleCounter > CrossCounter && CrossCounter == 0)
    return "Circle";
  if (CrossCounter > CircleCounter && CircleCounter == 0)
    return "Cross";
  if (CrossCounter == 0 && CircleCounter == 0){
    if (IsGameFinished())
      return "Draw";
    else
      return "Still playing";
  }
  return "Error";
}

function Display2DArray(Array2D){
  for (let i = 0; i < Array2D.length; ++i){
    console.log(Array2D[i]);
  }
}

function IsGameFinished(){
  let Flag = true;
  for (let i = 0; i < 5; ++i){
    for (let j = 0; j < 5; ++j){
      if (MainField.Data[i][j].Type == "Empty")
        Flag = false;
    }
  }
  return Flag;
}

function AreHere4CirclesInARow(Line){
  let Flag = false;
  for (let i = 0; i < Line.length - 3; ++i){
    if (Line[i].Type == Line[i + 1].Type && Line[i + 1].Type == Line[i + 2].Type && Line[i + 2].Type == Line[i + 3].Type && Line[i].Type == "Circle")
      Flag = true;
  }
  return Flag;
}

function AreHere4CrossesInARow(Line){
  let Flag = false;
  for (let i = 0; i < Line.length - 3; ++i){
    if (Line[i].Type == Line[i + 1].Type && Line[i + 1].Type == Line[i + 2].Type && Line[i + 2].Type == Line[i + 3].Type && Line[i].Type == "Cross")
      Flag = true;
  }
  return Flag;
}

function LoadBots(){
  for (let i = 0; i < 30; ++i){
    let PreTrainedModelBrain = NeuralNetwork.Deserialize(BotBrains[i]);
    PreTrainedModel = new Bot;
    PreTrainedModel.Brain = PreTrainedModelBrain;
    PreTrainedModel.NUMBER = i + 1;
    Bots.push(PreTrainedModel);
  }
}

function LoadModel(){
  let PreTrainedModelBrain = NeuralNetwork.Deserialize(ModelData);
  Player2 = new Bot;
  Player2.Brain = PreTrainedModelBrain;
}

function Restart(){
  RestartButton.html("Play again");
  MainField = new Field;
  History = [];
  LoadModel();
  Turn = 2;
  Player2.Type = "Cross";
  Player2.EnemyType = "Circle";
  History = [];
  if (Os != "IOS"){
    fullscreen(true);
  }
  screen.orientation.lock("portrait")
  .then(function() {
    console.log("Device orientation locked");
  })
  .catch(function(error) {
    console.log(error);
  });
  setTimeout(FirstMove, 1700);
}

function FirstMove(){
  Timer = frameCount;
  MainField.MakeMove(3, 3, "Cross");
  History.push("Cross: (" + 3 + ", " + 3 + ")");
  Turn = 1;
}
