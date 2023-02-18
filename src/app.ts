import express from 'express';
const app = express();
const port = 9000;

app.get('/', (req, res) => {
});

app.get('/status', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
