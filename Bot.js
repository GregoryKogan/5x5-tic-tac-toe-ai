class Bot{
  constructor(Parent){
    this.Input = [];
    this.Type = undefined;
    this.EnemyType = undefined;
    this.NUMBER = undefined;

    if (Parent)
      this.Brain = Parent.Brain.Copy();
    else{
      let BrainSpecs = new Specification;
      BrainSpecs.SetOptions(75, 1, 2, [50, 25]);
      this.Brain = new NeuralNetwork(BrainSpecs);
    }
  }

  async Think(CurrentField){
    let BestScore = -Infinity;
    let Move = new MoveInfo;
    for (let i = 0; i < 5; ++i){
      for (let j = 0; j < 5; ++j){
        if (CurrentField.Data[i][j].Type == "Empty"){
          CurrentField.MakeMove(i + 1, j + 1, this.Type);
          let Score = await this.Estimate(CurrentField, 0, "Human", -Infinity, Infinity);
          CurrentField.MakeMove(i + 1, j + 1, "Empty");
          if (Score > BestScore){
            BestScore = Score;
            Move.SetCoordinats(i + 1, j + 1);
          }
        }
      }
    }
    return Move;
  }

  async Estimate(GameField, Depth, Player, Alpha, Beta){
    let Status = this.GetStatus(GameField);
    if (Status != "Still playing"){
      if (Status == "Draw")
        return 0;
      else if (Status == "Error"){
        console.log("ERROR");
        return 0;
      }
      else if (Status == this.Type)
        return 10;
      else
        return -10;
    }

    if (Depth < 4){
      if (Player == "AI"){
        let BestScore = -Infinity;
        for (let i = 0; i < 5; ++i){
          for (let j = 0; j < 5; ++j){
            if (GameField.Data[i][j].Type == "Empty"){
              GameField.MakeMove(i + 1, j + 1, this.Type);
              let Score = await this.Estimate(GameField, Depth + 1, "Human", Alpha, Beta);
              GameField.MakeMove(i + 1, j + 1, "Empty");
              BestScore = max(BestScore, Score);
              Alpha = max(Alpha, BestScore);
              if (Beta <= Alpha)
                break;
            }
          }
        }
        return BestScore;
      }
      else{
        let WorstScore = Infinity;
        for (let i = 0; i < 5; ++i){
          for (let j = 0; j < 5; ++j){
            if (GameField.Data[i][j].Type == "Empty"){
              GameField.MakeMove(i + 1, j + 1, this.EnemyType);
              let Score = await this.Estimate(GameField, Depth + 1, "AI", Alpha, Beta);
              GameField.MakeMove(i + 1, j + 1, "Empty");
              WorstScore = min(WorstScore, Score);
              Beta = min(Beta, WorstScore);
              if (Beta <= Alpha)
                break;
            }
          }
        }
        return WorstScore;
      }
    }
    else{
      this.ConstructInput(GameField);
      let Output = this.Brain.Predict(this.Input);
      Output *= 20;
      Output -= 10;
      return Output;
    }
  }

  ConstructInput(CurrentField){
    let InputArray = [];
    for (let i = 0; i < 75; ++i)
      InputArray[i] = 0;
    let Index = 0;
    for (let i = 0; i < 5; ++i){
      for (let j = 0; j < 5; ++j){
        if(CurrentField.Data[i][j].Type == "Empty")
          InputArray[Index] = 1;
        else if (CurrentField.Data[i][j].Type != this.Type)
          InputArray[Index + 1] = 1;
        else
          InputArray[Index + 2] = 1;
        Index += 3;
      }
    }
    this.Input = InputArray;
  }

  GetStatus(CurrentField){
    //Разделить 2D доску на 16 1D массивов, а потом для каждого проверить есть ли там 4 подряд
    let ArrayStorage = [];
    //Горизонтали
    for (let i = 0; i < 5; ++i){
      let Line = [];
      for (let j = 0; j < 5; ++j){
        Line.push(CurrentField.Data[i][j])
      }
      ArrayStorage.push(Line);
    }
    //Вертикали
    for (let i = 0; i < 5; ++i){
      let Line = [];
      for (let j = 0; j < 5; ++j){
        Line.push(CurrentField.Data[j][i])
      }
      ArrayStorage.push(Line);
    }
    //Основные диагонали
    let UpDiagonal = [];
    let MidDiagonal = [];
    let DownDiagonal = [];
    MidDiagonal.push(CurrentField.Data[0][0]);
    DownDiagonal.push(CurrentField.Data[1][0]);
    for (let i = 1; i < 4; ++i){
      MidDiagonal.push(CurrentField.Data[i][i]);
      DownDiagonal.push(CurrentField.Data[i + 1][i]);
      UpDiagonal.push(CurrentField.Data[i - 1][i]);
    }
    MidDiagonal.push(CurrentField.Data[4][4]);
    UpDiagonal.push(CurrentField.Data[3][4]);
    ArrayStorage.push(MidDiagonal);
    ArrayStorage.push(DownDiagonal);
    ArrayStorage.push(UpDiagonal);
    //Побочные диагонали
    let DopUpDiagonal = [];
    let DopMidDiagonal = [];
    let DopDownDiagonal = [];
    DopMidDiagonal.push(CurrentField.Data[0][4]);
    DopDownDiagonal.push(CurrentField.Data[1][4]);
    for (let i = 1; i < 4; ++i){
      DopMidDiagonal.push(CurrentField.Data[i][4 - i]);
      DopDownDiagonal.push(CurrentField.Data[i + 1][4 - i]);
      DopUpDiagonal.push(CurrentField.Data[i - 1][4 - i]);
    }
    DopMidDiagonal.push(CurrentField.Data[4][0]);
    DopUpDiagonal.push(CurrentField.Data[3][0]);
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
      if (IsGameFinished(CurrentField))
        return "Draw";
      else
        return "Still playing";
    }
    return "Error";
  }

  IsGameFinished(CurrentField){
    let Flag = true;
    for (let i = 0; i < 5; ++i){
      for (let j = 0; j < 5; ++j){
        if (CurrentField.Data[i][j].Type == "Empty")
          Flag = false;
      }
    }
    return Flag;
  }

  AreHere4CirclesInARow(Line){
    let Flag = false;
    for (let i = 0; i < Line.length - 3; ++i){
      if (Line[i].Type == Line[i + 1].Type && Line[i + 1].Type == Line[i + 2].Type && Line[i + 2].Type == Line[i + 3].Type && Line[i].Type == "Circle")
        Flag = true;
    }
    return Flag;
  }

  AreHere4CrossesInARow(Line){
    let Flag = false;
    for (let i = 0; i < Line.length - 3; ++i){
      if (Line[i].Type == Line[i + 1].Type && Line[i + 1].Type == Line[i + 2].Type && Line[i + 2].Type == Line[i + 3].Type && Line[i].Type == "Cross")
        Flag = true;
    }
    return Flag;
  }

  Mutate(MutationRate){
    this.Brain.Mutate(MutationRate);
  }
}
