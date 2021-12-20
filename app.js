import Koa from 'koa';
import mainRouter from './routes/index.js';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import {SERVER_PORT,serverLogger} from './conf/config.js';
import RateLimit from 'koa2-ratelimit';
import path from 'path';
import ejs from 'koa-ejs';
const ratelimit = RateLimit.RateLimit;
const app = new Koa();

const limiter = ratelimit.middleware({
  interval: {min:1},
  max:1000
});

app.use(limiter);

// For access to token & cors
app.use(cors(
  {
    credentials:true
  }
));
app.use(bodyParser());
app.use(mainRouter.routes()).use(mainRouter.allowedMethods);

export const staticPath = path.join(path.resolve(), '/views');

ejs(app, {
  root: staticPath ,
  viewExt: 'ejs',
  layout: false
});

app.listen(SERVER_PORT,()=>{
  serverLogger.info(`Server open, Listening to port ${ SERVER_PORT}`);
});

