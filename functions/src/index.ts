import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';

import { Auth } from './controllers';
import { verifyToken } from './utils'
const authCtrl = new Auth();
const app = express();
app.use(cors());

app.get('/', (_: any, res: express.Response) => {
  res.send('Сервер для Донбасс Оперы, запущен');
});
app.post('/auth', authCtrl.create);
app.post('/getMe', authCtrl.show);
app.get(`/user/:login`, verifyToken, authCtrl.info);

exports.api = functions.https.onRequest(app);