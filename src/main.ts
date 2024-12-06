import { LinearRegression } from './models/LinearRegression';
import { generateSyntheticData } from './utils/mathUtils';
import { Matrix, Vector } from './types/math';
import { Chat } from './components/Chat';
import './style.css';

let currentData: { X: Matrix; y: Vector } | null = null;
let model: LinearRegression | null = null;

function createUI(): void {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div id="chat"></div>
    <div class="container">
      <h1>TypeScript Linear Regression</h1>
      
      <div class="info">
        <h2>Features</h2>
        <ul>
          <li>Vectorized matrix operations</li>
          <li>Gradient descent optimization</li>
          <li>Type-safe implementation</li>
          <li>Real-time visualization</li>
        </ul>
      </div>

      <div class="buttons">
        <button onclick="window.generateData()">Generate Data</button>
        <button onclick="window.trainModel()">Train Model</button>
      </div>
      
      <div id="results"></div>
      <div id="plot"></div>
    </div>
  `;

  // Initialize chat
  new Chat('chat');
}

function plotData(predictions?: Vector): void {
  if (!currentData) return;

  const trace1 = {
    x: currentData.X.map(x => x[0]),
    y: currentData.y,
    mode: 'markers',
    type: 'scatter',
    name: 'Data',
    marker: { color: '#4ade80', size: 8 }
  };

  const data = [trace1];

  if (predictions) {
    const sortedPoints = currentData.X.map((x, i) => ({
      x: x[0],
      y: predictions[i]
    })).sort((a, b) => a.x - b.x);

    const trace2 = {
      x: sortedPoints.map(p => p.x),
      y: sortedPoints.map(p => p.y),
      mode: 'lines',
      type: 'scatter',
      name: 'Prediction',
      line: { color: '#22c55e', width: 2 }
    };
    data.push(trace2);
  }

  const layout = {
    paper_bgcolor: '#333',
    plot_bgcolor: '#333',
    font: { color: '#fff' },
    xaxis: { 
      gridcolor: '#444',
      zerolinecolor: '#444',
      title: 'Feature X'
    },
    yaxis: { 
      gridcolor: '#444',
      zerolinecolor: '#444',
      title: 'Target Y'
    },
    margin: { t: 30 }
  };

  Plotly.newPlot('plot', data, layout);
}

function displayResults(): void {
  if (!model) return;
  
  const params = model.getParams();
  const resultsDiv = document.getElementById('results')!;
  resultsDiv.innerHTML = `
    <strong>Trained Model:</strong><br>
    y = ${params.weights[0].toFixed(4)}x₁ + ${params.weights[1].toFixed(4)}x₂ + ${params.bias.toFixed(4)}
  `;
}

window.generateData = () => {
  currentData = generateSyntheticData();
  plotData();
  document.getElementById('results')!.innerHTML = 'Data generated! Click Train Model to fit the line.';
};

window.trainModel = () => {
  if (!currentData) {
    alert('Generate data first!');
    return;
  }

  document.getElementById('results')!.innerHTML = 'Training...';
  
  model = new LinearRegression(0.01);
  model.train(currentData.X, currentData.y);
  
  const predictions = model.predict(currentData.X);
  plotData(predictions);
  displayResults();
};

// Initialize the application
createUI();
window.generateData();