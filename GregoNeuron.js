class Matrix{
  constructor(Rows, Coloumns){
    this.Rows = Rows;
    this.Coloumns = Coloumns;

    this.Values = [];
    for (let i = 0; i < this.Rows; ++i){
      this.Values[i] = [];
      for (let j = 0; j < this.Coloumns; ++j){
        this.Values[i][j] = 0;
      }
    }
  }

  static Multiply(m1, m2){
    if (m1.Coloumns != m2.Rows) return undefined;
    let Result = new Matrix(m1.Rows, m2.Coloumns);
    for (let i = 0; i < Result.Rows; ++i){
      for (let j = 0; j < Result.Coloumns; ++j){
        let Sum = 0;
        for (let k = 0; k < m1.Coloumns; ++k){
          Sum += m1.Values[i][k] * m2.Values[k][j];
        }
        Result.Values[i][j] = Sum;
      }
    }
    return Result;
  }

  Multiply(n){
    if (n instanceof Matrix){
      for (let i = 0; i < this.Rows; ++i){
        for (let j = 0; j < this.Coloumns; ++j){
          this.Values[i][j] *= n.Values[i][j];
        }
      }
    }
    else{
      for (let i = 0; i < this.Rows; ++i){
        for (let j = 0; j < this.Coloumns; ++j){
          this.Values[i][j] *= n;
        }
      }
    }
  }

  FillRandom(){
    for (let i = 0; i < this.Rows; ++i){
      for (let j = 0; j < this.Coloumns; ++j){
        this.Values[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  Copy(){
    let Result = new Matrix(this.Rows, this.Coloumns);
    for (let i = 0; i < this.Rows; ++i){
      for (let j = 0; j < this.Coloumns; ++j){
        Result.Values[i][j] = this.Values[i][j];
      }
    }
    return Result;
  }

  static Transpose(m1){
    let Result = new Matrix(m1.Coloumns, m1.Rows);
    for (let i = 0; i < m1.Rows; ++i){
      for (let j = 0; j < m1.Coloumns; ++j){
        Result.Values[j][i] = m1.Values[i][j];
      }
    }
    return Result;
  }

  Add(n) {
    if (n instanceof Matrix) {
      for (let i = 0; i < this.Rows; i++) {
        for (let j = 0; j < this.Coloumns; j++) {
          this.Values[i][j] += n.Values[i][j];
        }
      }
    }
    else {
      for (let i = 0; i < this.Rows; i++) {
        for (let j = 0; j < this.Coloumns; j++) {
          this.Values[i][j] += n;
        }
      }
    }
  }

  static Substract(m1, m2){
    let Result = new Matrix(m1.Rows, m1.Coloumns);
    for (let i = 0; i < Result.Rows; ++i){
      for (let j = 0; j < Result.Coloumns; ++j){
        Result.Values[i][j] = m1.Values[i][j] - m2.Values[i][j];
      }
    }
    return Result;
  }

  static ApplyFunction(M, F){
    let Result = new Matrix(M.Rows, M.Coloumns);
    for (let i = 0; i < M.Rows; ++i){
      for (let j = 0; j < M.Coloumns; ++j){
        let Value = M.Values[i][j];
        Result.Values[i][j] = F(Value);
      }
    }
    return Result;
  }

  ApplyFunction(F){
    for (let i = 0; i < this.Rows; ++i){
      for (let j = 0; j < this.Coloumns; ++j){
        let Value = this.Values[i][j];
        this.Values[i][j] = F(Value);
      }
    }
  }

  static MakeArray(InputMatrix){
    let A = [];
    for (let i = 0; i < InputMatrix.Rows; ++i){
      for (let j = 0; j < InputMatrix.Coloumns; ++j){
        A.push(InputMatrix.Values[i][j]);
      }
    }
    return A;
  }

  static MakeMatrix(InputArray){
    let M = new Matrix(InputArray.length, 1);
    for (let i = 0; i < InputArray.length; ++i){
      M.Values[i][0] = InputArray[i];
    }
    return M;
  }

  Print(){
    console.table(this.Values);
  }

  static Deserialize(DataFile) {
    if (typeof DataFile == 'string') {
      DataFile = JSON.parse(DataFile);
    }
    let Result = new Matrix(DataFile.Rows, DataFile.Coloumns);
    Result.Values = DataFile.Values;
    return Result;
  }
}

function Sigmoid(x){
  return 1 / (1 + Math.exp(-x));
}

function SigmoidDerivative(S){
  //return Sigmoid(x) * (1 - Sigmoid(x));
  return S * (1 - S);
}

class Specification{
  constructor(){
    this.InputNum = 1;
    this.OutputNum = 1;
    this.HiddenLayersNum = 1;
    this.HiddenNum = [1];
  }

  SetOptions(Input, Output, HiddenLayersNum, HiddenNum){
    this.InputNum = Input;
    this.OutputNum = Output;
    this.HiddenLayersNum = HiddenLayersNum;
    this.HiddenNum = HiddenNum;
  }
}

class NeuralNetwork{
  constructor(Options){
    if (Options instanceof NeuralNetwork){
      this.NumOfInputNeurons = Options.NumOfInputNeurons;
      this.NumOfOutputNeurons = Options.NumOfOutputNeurons;
      this.NumOfHiddenLayers = Options.NumOfHiddenLayers;
      this.NumOfHiddenNeuronsPerLayer = Options.NumOfHiddenNeuronsPerLayer;

      this.Weights = [];
      this.Biases = [];
      for (let i = 0; i < Options.Weights.length; ++i){
        this.Weights[i] = Options.Weights[i].Copy();
      }
      for (let i = 0; i < Options.Biases.length; ++i){
        this.Biases[i] = Options.Biases[i].Copy();
      }

      this.LearningRate = Options.LearningRate;
    }
    else if (Options){
      this.NumOfInputNeurons = undefined;
      this.NumOfOutputNeurons = undefined;
      this.NumOfHiddenLayers = undefined;
      this.NumOfHiddenNeuronsPerLayer = undefined;

      this.Weights = [];
      this.Biases = [];

      this.LearningRate = undefined;

      this.SetSpecs(Options);
    }
  }

  SetSpecs(Specs){
    this.NumOfInputNeurons = Specs.InputNum;
    this.NumOfOutputNeurons = Specs.OutputNum;

    this.NumOfHiddenLayers = Specs.HiddenLayersNum;
    this.NumOfHiddenNeuronsPerLayer = Specs.HiddenNum;

    this.Weights = [];
    for (let i = 0; i < this.NumOfHiddenLayers + 1; ++i){
      let WeightsI;
      if (i == 0){ // First weights
        WeightsI = new Matrix(this.NumOfHiddenNeuronsPerLayer[0], this.NumOfInputNeurons);
      }
      else if (i == this.NumOfHiddenLayers){ // Last weights
        WeightsI = new Matrix(this.NumOfOutputNeurons, this.NumOfHiddenNeuronsPerLayer[this.NumOfHiddenLayers - 1]);
      }
      else{ // All other weights
        WeightsI = new Matrix(this.NumOfHiddenNeuronsPerLayer[i], this.NumOfHiddenNeuronsPerLayer[i - 1]);
      }
      WeightsI.FillRandom();
      this.Weights.push(WeightsI);
    }

    this.Biases = [];
    for (let i = 0; i < this.NumOfHiddenLayers; ++i){
      let BiasI;
      BiasI = new Matrix(this.NumOfHiddenNeuronsPerLayer[i], 1);
      BiasI.FillRandom();
      this.Biases.push(BiasI);
    }
    let BiasO = new Matrix(this.NumOfOutputNeurons, 1);
    BiasO.FillRandom();
    this.Biases.push(BiasO);

    this.LearningRate = 0.1;
  }

  Predict(InputArray){
    let Input = Matrix.MakeMatrix(InputArray);

    let FirstHidden = Matrix.Multiply(this.Weights[0], Input);
    FirstHidden.Add(this.Biases[0]);
    FirstHidden.ApplyFunction(Sigmoid);

    let PreviousLayerResult = FirstHidden;

    for (let i = 1; i < this.NumOfHiddenLayers; ++i){
      let HiddenI = Matrix.Multiply(this.Weights[i], PreviousLayerResult);
      HiddenI.Add(this.Biases[i]);
      HiddenI.ApplyFunction(Sigmoid);
      PreviousLayerResult = HiddenI;
    }

    let Output = Matrix.Multiply(this.Weights[this.NumOfHiddenLayers], PreviousLayerResult);
    Output.Add(this.Biases[this.NumOfHiddenLayers]);
    Output.ApplyFunction(Sigmoid);

    return Matrix.MakeArray(Output);
  }

  Train(InputArray, Answer){
    let LayersResults = [];

    let Input = Matrix.MakeMatrix(InputArray);

    let FirstHidden = Matrix.Multiply(this.Weights[0], Input);
    FirstHidden.Add(this.Biases[0]);
    FirstHidden.ApplyFunction(Sigmoid);

    let PreviousLayerResult = FirstHidden;
    LayersResults.push(FirstHidden);

    for (let i = 1; i < this.NumOfHiddenLayers; ++i){
      let HiddenI = Matrix.Multiply(this.Weights[i], PreviousLayerResult);
      HiddenI.Add(this.Biases[i]);
      HiddenI.ApplyFunction(Sigmoid);
      PreviousLayerResult = HiddenI;
      LayersResults.push(HiddenI);
    }

    let Output = Matrix.Multiply(this.Weights[this.NumOfHiddenLayers], PreviousLayerResult);
    Output.Add(this.Biases[this.NumOfHiddenLayers]);
    Output.ApplyFunction(Sigmoid);
    LayersResults.push(Output);

    let NextError;

    let Target = Matrix.MakeMatrix(Answer);
    let OutputError = Matrix.Substract(Target, Output);
    NextError = OutputError;
    let Gradient = Matrix.ApplyFunction(Output, SigmoidDerivative);
    Gradient.Multiply(OutputError);
    Gradient.Multiply(this.LearningRate);
    let TransposedLastHidden = Matrix.Transpose(PreviousLayerResult);
    let WeightDeltaHO = Matrix.Multiply(Gradient, TransposedLastHidden);
    this.Weights[this.NumOfHiddenLayers].Add(WeightDeltaHO);
    this.Biases[this.NumOfHiddenLayers].Add(Gradient);

    for (let i = this.NumOfHiddenLayers - 1; i >= 0; --i){
      let NextWeightsTransposed = Matrix.Transpose(this.Weights[i + 1]);
      let HiddenErrorI = Matrix.Multiply(NextWeightsTransposed, NextError);
      NextError = HiddenErrorI;
      let HiddenGradientI = Matrix.ApplyFunction(LayersResults[i], SigmoidDerivative);
      HiddenGradientI.Multiply(HiddenErrorI);
      HiddenGradientI.Multiply(this.LearningRate);
      let TransposedPrevious;
      if (i > 0)
        TransposedPrevious = Matrix.Transpose(LayersResults[i - 1]);
      else
        TransposedPrevious = Matrix.Transpose(Input);
      let WeightDeltaI = Matrix.Multiply(HiddenGradientI, TransposedPrevious);
      this.Weights[i].Add(WeightDeltaI);
      this.Biases[i].Add(HiddenGradientI);
    }
  }

  SetLearningRate(n){
    this.LearningRate = n;
  }

  Copy(){
    return new NeuralNetwork(this);
  }

  Mutate(MutationRate){
    function Mutate(x){
      if (Math.random() < MutationRate)
        if (Math.random() > 0.5)
          return x + ((Math.random() - 0.5) / 5);
        else return Math.random() * 2 - 1;
      else return x;
    }
    for (let i = 0; i < this.NumOfHiddenLayers + 1; ++i){
      this.Weights[i].ApplyFunction(Mutate);
      this.Biases[i].ApplyFunction(Mutate);
    }
  }

  static CrossOver(Parent1, Parent2){
    let Result = new NeuralNetwork(Parent1);
    for (let i = 0; i < Result.NumOfHiddenLayers + 1; ++i){

      for (let j = 0; j < Result.Weights[i].Rows; ++j){
        for (let k = 0; k < Result.Weights[i].Coloumns; ++k){
          if (Math.random() > 0.5)
            Result.Weights[i].Values[j][k] = Parent2.Weights[i].Values[j][k];
        }
      }

      for (let j = 0; j < Result.Biases[i].Rows; ++j){
        for (let k = 0; k < Result.Biases[i].Coloumns; ++k){
          if (Math.random() > 0.5)
            Result.Biases[i].Values[j][k] = Parent2.Biases[i].Values[j][k];
        }
      }
    }
    return Result;
  }

  static Deserialize(DataFile) {
    if (typeof DataFile == 'string') {
      DataFile = JSON.parse(DataFile);
    }

    let ReconstructedBrain = new NeuralNetwork();

    ReconstructedBrain.NumOfInputNeurons = DataFile.NumOfInputNeurons;
    ReconstructedBrain.NumOfOutputNeurons = DataFile.NumOfOutputNeurons;
    ReconstructedBrain.NumOfHiddenLayers = DataFile.NumOfHiddenLayers;
    ReconstructedBrain.NumOfHiddenNeuronsPerLayer = DataFile.NumOfHiddenNeuronsPerLayer;

    ReconstructedBrain.Weights = [];
    ReconstructedBrain.Biases = [];

    for (let i = 0; i < DataFile.NumOfHiddenLayers + 1; ++i){
      ReconstructedBrain.Weights[i] = Matrix.Deserialize(DataFile.Weights[i]);
    }
    for (let i = 0; i < DataFile.NumOfHiddenLayers + 1; ++i){
      ReconstructedBrain.Biases[i] = Matrix.Deserialize(DataFile.Biases[i]);
    }

    ReconstructedBrain.LearningRate = DataFile.LearningRate;

    return ReconstructedBrain;
  }
}
