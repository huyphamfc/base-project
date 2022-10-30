const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');

dotenv.config();
const { MONGODB_URI } = process.env;
const PORT = process.env.PORT || 8000;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connect MongoDB successfully.'));

app.listen(PORT, () => console.log(`Sever running on port ${PORT}.`));
