import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';

import { Auth, TimeTable } from './controllers';
import { verifyToken } from './utils'
const authCtrl = new Auth();
const timeTableCtrl = new TimeTable();
const app = express();
app.use(cors());
/**
 * Роуты авторизации пользователей
 */
app.get('/', (_: any, res: express.Response) => {
  res.send('Сервер для Донбасс Оперы, запущен');
});
app.post('/auth', authCtrl.create);
app.post('/getMe', authCtrl.show);
app.get(`/user/:login`, verifyToken, authCtrl.info);
app.put(`/user/:login`, verifyToken, authCtrl.edit);
app.delete(`/user/:login`, verifyToken, authCtrl.delete);
/**
 * Роуты графика выходов
 */
app.get('/timetable', verifyToken, timeTableCtrl.snow);
app.get(`/timetable/:period`, verifyToken, timeTableCtrl.showPeriod);
app.post('/timetable', verifyToken, timeTableCtrl.create);
app.put('/timetable', verifyToken, timeTableCtrl.update);
app.delete('/timetable', verifyToken, timeTableCtrl.delete);

exports.api = functions.https.onRequest(app);