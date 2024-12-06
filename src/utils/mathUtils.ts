import { Matrix, Vector } from '../types/math';

export function generateSyntheticData(
  nSamples: number = 100,
  noiseStd: number = 0.1
): { X: Matrix; y: Vector } {
  const X: Matrix = Array(nSamples).fill(0).map(() => [
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ]);
  
  const trueWeights: Vector = [2.0, -1.5];
  const trueBias = 0.5;
  
  const y: Vector = X.map(row => 
    dot(row, trueWeights) + trueBias + (Math.random() * 2 - 1) * noiseStd
  );
  
  return { X, y };
}

export function mean(arr: Vector): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function dot(a: Vector, b: Vector): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

export function subtract(a: Vector, b: Vector): Vector {
  return a.map((val, i) => val - b[i]);
}

export function multiply(a: Vector, b: number | Vector): Vector {
  if (typeof b === 'number') {
    return a.map(val => val * b);
  }
  return a.map((val, i) => val * b[i]);
}