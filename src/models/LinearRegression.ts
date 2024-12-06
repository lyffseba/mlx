import { Matrix, Vector } from '../types/math';
import { mean, dot, subtract, multiply } from '../utils/mathUtils';

export class LinearRegression {
  private weights: Vector | null = null;
  private bias: number = 0;
  private readonly learningRate: number;

  constructor(learningRate: number = 0.01) {
    this.learningRate = learningRate;
  }

  private computeLoss(X: Matrix, y: Vector, weights: Vector, bias: number): number {
    const predictions = X.map(row => dot(row, weights) + bias);
    const errors = subtract(predictions, y);
    return mean(multiply(errors, errors));
  }

  train(X: Matrix, y: Vector, epochs: number = 1000): void {
    const numFeatures = X[0].length;
    this.weights = Array(numFeatures).fill(0).map(() => Math.random() - 0.5);
    this.bias = 0;

    for (let epoch = 0; epoch < epochs; epoch++) {
      const predictions = X.map(row => dot(row, this.weights!) + this.bias);
      const errors = subtract(predictions, y);
      
      // Compute gradients
      const weightGradients = X[0].map((_, j) => 
        mean(X.map((row, i) => row[j] * errors[i])) * 2
      );
      const biasGradient = mean(errors) * 2;

      // Update parameters
      this.weights = subtract(this.weights!, multiply(weightGradients, this.learningRate));
      this.bias -= biasGradient * this.learningRate;
    }
  }

  predict(X: Matrix): Vector {
    if (!this.weights) {
      throw new Error('Model must be trained first');
    }
    return X.map(row => dot(row, this.weights!) + this.bias);
  }

  getParams(): { weights: Vector; bias: number } {
    if (!this.weights) {
      throw new Error('Model must be trained first');
    }
    return {
      weights: this.weights,
      bias: this.bias
    };
  }
}