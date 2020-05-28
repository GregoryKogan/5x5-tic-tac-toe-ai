class Field{
  constructor(){
    this.Data = [];
    for (let i = 0; i < 5; ++i){
      let NewRow = [];
      for (let j = 0; j < 5; ++j){
        let NewCell = new Cell;
        NewRow.push(NewCell);
      }
      this.Data.push(NewRow);
    }
  }

  Render(){
    let Width;
    let StartX;
    let StartY;
    if (Device == "Laptop"){
      Width = windowWidth / 3;
      StartX = (windowWidth / 2) - (Width / 2);
      StartY = (windowHeight / 2) - (Width / 2);
    }
    else{
      Width = windowWidth - 30;
      StartX = (windowWidth / 2) - (Width / 2);
      StartY = 100;
    }
    push();
    noFill();
    stroke(246, 202, 9);
    strokeWeight(3);
    square(StartX - 3, StartY - 3, Width + 6);
    pop();
    for (let i = 0; i < 5; ++i){
      for (let j = 0; j < 5; ++j){
        let DrawX = StartX + (j * Width / 5);
        let DrawY = StartY + (i * Width / 5);
        push();
        noFill();
        stroke(255);
        strokeWeight(3);
        square(DrawX, DrawY, Width / 5);
        if (Device == "Laptop")
          strokeWeight(5);
        else
          strokeWeight(3);
        if (this.Data[i][j].Type == "Circle"){
          circle(DrawX + Width / 10, DrawY + Width / 10, Width / 7);
        }
        else if (this.Data[i][j].Type == "Cross"){
          line(DrawX + Width / 25, DrawY + Width / 25, DrawX + Width * 0.16, DrawY + Width * 0.16);
          line(DrawX + Width * 0.16, DrawY + Width / 25, DrawX + Width / 25, DrawY + Width * 0.16);
        }
        pop();
      }
    }
  }

  MakeMove(y, x, Type){
    this.Data[y - 1][x - 1].SetType(Type);
  }

  Copy(){
    let Result = new Field;
    for (let i = 0; i < 5; ++i){
      for (let j = 0; j < 5; ++j){
        Result.Data[i][j] = this.Data[i][j];
      }
    }
    return Result;
  }

  Clear(){
    for (let i = 0; i < 5; ++i){
      for (let j = 0; j < 5; ++j){
        this.Data[i][j].SetType("Empty");
      }
    }
  }
}
