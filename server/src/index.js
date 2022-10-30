const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Sever running on port ${PORT}.`));
