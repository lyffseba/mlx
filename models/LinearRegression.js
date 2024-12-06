import { mean, sum } from '../utils/mathUtils.js';

export class LinearRegression {
  constructor(learningRate = 0.01) {
    this.learningRate = learningRate;
    this.weight = null;
    this.bias = null;
  }

  train(X, y, epochs = 100) {
    const n = X.length;
    this.weight = Math.random();
    this.bias = 0.0;

    for (let epoch = 0; epoch < epochs; epoch++) {
      // Forward pass
      const predictions = X.map(x => this.weight * x + this.bias);

      // Compute gradients
      const errors = predictions.map((pred, i) => pred - y[i]);
      const dw = (2 / n) * sum(X.map((x, i) => x * errors[i]));
      const db = (2 / n) * sum(errors);

      // Update parameters
      this.weight -= this.learningRate * dw;
      this.bias -= this.learningRate * db;
    }
  }

  predict(X) {
    return X.map(x => this.weight * x + this.bias);
  }

  getParams() {
    return {
      weight: this.weight,
      bias: this.bias
    };
  }
}