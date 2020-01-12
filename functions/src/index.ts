import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as dotenv from 'dotenv'
import * as webpush from 'web-push'

import { Auth, TimeTable, Notifications } from './controllers'
import { verifyToken } from './utils'

const authCtrl = new Auth();
const timeTableCtrl = new TimeTable();
const notifiCtrl = new Notifications()
const app = express();
dotenv.config()
app.use(cors());

webpush.setVapidDetails('mailto: vashdns@gmail.com', 'BDWa5QP_MgHnGivnoZ-rGGLWSUi1Ft0BK7eQWNQ0qxz4slVSa1r_6dCDWyCa9D-fgRk7lXqF5fKVnnu0XYtylW0', 'dD2ZbRnOnv3AisJBC0qBfUjzUI5-zgk4P3lLT_pI2BY')
//webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)
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

/**
 * Роут Нотификации
 */
app.post('/notifications/subscribe', notifiCtrl.create)
app.post('/notifications/send', notifiCtrl.sendAll)
/*app.post('/notifications/subscribe', (req: express.Request, res: express.Response) => {
  const subscription = req.body
  console.log(subscription)
  const payload = JSON.stringify({
    title: 'Hello!',
    body: 'It works.',
  })

  webpush.sendNotification(subscription, payload)
    .then(result => console.log(result))
    .catch(e => console.log(e.stack))

  res.status(200).json({'success': true})
})*/
 

exports.api = functions.https.onRequest(app);