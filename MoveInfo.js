class MoveInfo{
  constructor(y, x){
    if (y && x){
      this.y = y;
      this.x = x;
    }
    else{
      this.y = undefined;
      this.x = undefined;
    }
  }

  SetCoordinats(y, x){
    this.y = y;
    this.x = x;
  }
}
