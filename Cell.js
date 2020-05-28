class Cell{
  constructor(Type){
    if (Type)
      this.Type = Type;
    else
      this.Type = "Empty";
  }

  SetType(Type){
    this.Type = Type;
  }
}
