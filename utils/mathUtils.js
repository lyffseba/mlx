export function generateSampleData(nSamples = 100, noiseStd = 0.1) {
  const X = Array.from({ length: nSamples }, () => Math.random() * 2 - 1);
  const trueWeight = 2.0;
  const trueBias = 0.5;
  const y = X.map(x => 
    trueWeight * x + trueBias + (Math.random() * 2 - 1) * noiseStd
  );
  return { X, y };
}

export function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}