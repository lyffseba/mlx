import express from 'express';
import cors from 'cors';
import { generateSampleData } from './utils/mathUtils.js';
import { LinearRegression } from './models/LinearRegression.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const model = new LinearRegression();

app.get('/generate_data', (req, res) => {
  const { X, y } = generateSampleData();
  res.json({ X, y });
});

app.post('/train', (req, res) => {
  const { X, y } = req.body;
  model.train(X, y);
  res.json(model.getParams());
});

app.post('/predict', (req, res) => {
  const { X } = req.body;
  const predictions = model.predict(X);
  res.json({ predictions });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});