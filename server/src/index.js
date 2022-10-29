const express = require('express');

const app = express();

app.get('/api', (req, res) => {
  res.end("Hello, I'm a server!");
});

app.listen(8000, () => console.log('Sever running on port 8000.'));
