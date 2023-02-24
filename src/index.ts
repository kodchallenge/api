import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as path from 'path';
import { errorHandler } from './middlewares/errorHandler';
import router from './routers/router';
import 'express-async-errors'
require("dotenv").config();
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use((req, res, next) => {
  try {
    next()
  } catch (err: any) {
    console.log("HATA OLUSTU", err?.message)
  }
})

app.use('/v1', router);

app.use(function (req, res, next) {
  next(new Error("404"));
});

app.use(errorHandler);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/v1`);
});
server.on('error', console.error);
