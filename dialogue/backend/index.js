// index.js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const dotenv = require('dotenv');
const dialogueRoute = require('./routes/dialogue');

dotenv.config();

const app = new Koa();
app.use(cors());
app.use(bodyParser());

app.use(dialogueRoute.routes()).use(dialogueRoute.allowedMethods());

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Dialogue Generator backend running at http://localhost:${PORT}`);
});
